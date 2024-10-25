import readline from "readline";
import InventoryManager, {Inventory} from "./manager/InventoryManager";
import ChangeManager, {Change} from "./manager/ChangeManger";
import PaymentManager, {PaymentMethod} from "./manager/PaymentManager";

interface IVendingMachine {
  setChange: (changes: Change[]) => void;
  setInventory: (inventory: Inventory[]) => void;
  getBeverageByCard: (input: InputCard) => void;
  getBeverageByCash: (input: InputCash) => void;
}

class VendingMachine implements IVendingMachine {
  private inventoryManager: InventoryManager;
  private paymentManager: PaymentManager;
  private changeManager: ChangeManager;

  constructor({
                inventoryManager,
                changeManager,
                paymentManager,
              }: VendingMachineProps) {
    this.inventoryManager = inventoryManager;
    this.changeManager = changeManager;
    this.paymentManager = paymentManager;
  }

  // 잔돈 관리
  setChange(changes: Change[]) {
    this.changeManager.setChange(changes);
  }

  // 재고 관리
  setInventory(inventory: Inventory[]) {
    this.inventoryManager.setInventory(inventory);
  }

  // 사용자로부터 카드 결제 요청 받기
  getBeverageByCard(input: InputCard) {
    this.paymentManager.setInputCard(input);
    this.processPaymentByCard();
  }

  // 사용자로부터 현금 결제 요청 받기
  getBeverageByCash(input: InputCash) {
    this.paymentManager.setInputCash(input);
    this.processPaymentByCash();
  }

  // 카드 결제 처리
  private processPaymentByCard() {
    if (!this.paymentManager.isCardValid()) {
      this.serveResult({
        message: '사용할 수 없는 카드입니다.',
        paymentMethod: "card"
      });
      return;
    }

    this.handleProductSelection("card");
  }

  // 현금 결제 처리
  private processPaymentByCash() {
    this.handleProductSelection("cash");
  }

  // 제품 선택 공통 처리 로직
  private handleProductSelection(paymentMethod: PaymentMethod) {
    const cashAmount = this.paymentManager.getValidCashSum();
    const availableProducts = this.inventoryManager.getAvailableProducts({paymentMethod, cashAmount});

    if (availableProducts.length === 0) {
      this.serveResult({
        message: "구매 가능한 상품이 없습니다.",
        paymentMethod,
        change: this.paymentManager.getValidInputCash(),
        invalidChange: this.paymentManager.getInvalidInputCash()
      });
      return;
    }

    this.promptUserForProduct(availableProducts, paymentMethod);
  }

  private promptUserForProduct(availableProducts: Inventory[], paymentMethod: PaymentMethod) {
    const products = availableProducts.map(item => item.product);
    const options = [...products, 'cancel'].join(', ');

    this.promptMessage({
      query: `메뉴: [ ${options} ] 중에 하나를 고르세요. 입력: `,
      callback: (selectedProduct: string) => {
        if (selectedProduct === "cancel") {
          this.serveResult({
            message: '안녕히 가십시오!',
            change: this.paymentManager.getValidInputCash(),
            invalidChange: this.paymentManager.getInvalidInputCash(),
            paymentMethod
          });
          return;
        } else if (!products.includes(selectedProduct)) {
          this.serveResult({
            message: '잘못된 선택입니다. 다시 시도해주세요.',
            change: this.paymentManager.getValidInputCash(),
            invalidChange: this.paymentManager.getInvalidInputCash(),
            paymentMethod
          });
          return;
        }
        if (paymentMethod === 'card') {
          this.processSelectedProductWithCard(selectedProduct);
        } else {
          this.processSelectedProductWithCash(selectedProduct);
        }
      }
    });
  }

  private processSelectedProductWithCard(selectedProduct: string) {
    const price = this.inventoryManager.getProductPrice(selectedProduct);

    try {
      this.paymentManager.requestCardApproval();
      this.inventoryManager.reduceInventory(selectedProduct);
      this.serveResult({
        message: '맛있게 드세요!',
        product: selectedProduct,
        price: price,
        paymentMethod: "card"
      });
    } catch (e) {
      this.serveResult({
        message: '카드 결제에 실패했습니다.',
        paymentMethod: "card"
      });
    }
  }

  private processSelectedProductWithCash(selectedProduct: string) {
    const sumOfValidCash = this.paymentManager.getValidCashSum();
    const price = this.inventoryManager.getProductPrice(selectedProduct);
    const change = this.changeManager.calculateChange({
      remainingAmount: sumOfValidCash - price,
      inputCash: this.paymentManager.getValidInputCash() // 사용자에게서 받은 현금을 포함하여 잔돈을 계산한다
    });
    const sumOfChange = this.paymentManager.sumElementsOfArray(change);

    if (this.changeManager.isChangeCorrect(sumOfValidCash, price, sumOfChange)) {
      this.changeManager.addInputCashToChange(this.paymentManager.getValidInputCash());
      this.changeManager.reduceChange(change);
      this.inventoryManager.reduceInventory(selectedProduct);
      this.serveResult({
        message: '맛있게 드세요!',
        product: selectedProduct,
        price: price,
        change: change,
        invalidChange: this.paymentManager.getInvalidInputCash(),
        paymentMethod: "cash"
      });
    } else {
      this.handleInsufficientChange();
    }
  }

  private handleInsufficientChange() {
    const validCash = this.paymentManager.getValidInputCash();
    this.serveResult({
      message: '잔돈이 모자랍니다. 카드 결제를 이용하거나 다음에 이용해주세요.',
      paymentMethod: "cash",
      change: validCash,
      invalidChange: this.paymentManager.getInvalidInputCash()
    });
  }

  private serveResult({
                        message = '안녕히 가십시오!',
                        product,
                        price = 0,
                        paymentMethod,
                        change,
                        invalidChange
                      }: OutputMessage) {
    console.log('결과: ', {
      message,
      price,
      paymentMethod,
      ...(product ? {product} : {}),
      ...(change ? {change} : {}),
      ...(invalidChange ? {invalidChange} : {})
    });
  }

  private promptMessage = ({
                             query, callback
                           }: PromptMessage) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(query, (answer: string) => {
      callback(answer);
      rl.close();
    });
  }
}

export default VendingMachine;


export type InputCash = number[];
export type InputCard = 'card' | string;
type OutputMessage = {
  product?: string;
  message?: string;
  paymentMethod?: PaymentMethod;
  price?: number;
  change?: number[];
  invalidChange?: InputCash;
}
type PromptMessage = {
  query: string;
  callback: (answer: string) => void;
}
type VendingMachineProps = {
  inventoryManager: InventoryManager;
  paymentManager: PaymentManager;
  changeManager: ChangeManager;
}
