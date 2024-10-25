import {InputCard, InputCash} from "../VendingMachine";

interface IPaymentManager {
  sumElementsOfArray: (array: number[]) => number;
  isCardValid: () => boolean;
  getValidCashSum: () => number;
  getValidInputCash: () => InputCash;
  getInvalidInputCash: () => InputCash;
  setInputCash: (input:InputCash) => void;
  setInputCard: (input: InputCard) => void;
  requestCardApproval: () => boolean;
}

class PaymentManager implements IPaymentManager {
  static AVAILABLE_DENOMINATIONS = [100, 500, 1000, 5000, 10000];
  static AVAILABLE_CARD = ['card'];

  private validInputCash: InputCash = [];
  private invalidInputCash: InputCash = [];
  private cardInput: InputCard = '';

  sumElementsOfArray(array: number[]) {
    return array.reduce((sum, value) => sum + value, 0);
  }

  isCardValid(): boolean {
    return PaymentManager.AVAILABLE_CARD.includes(this.cardInput);
  }

  getValidCashSum() {
    return this.sumElementsOfArray(this.validInputCash);
  }

  getValidInputCash() {
    return this.validInputCash;
  }

  getInvalidInputCash() {
    return this.invalidInputCash;
  }

  setInputCash(input:InputCash) {
    input.forEach(item => {
      PaymentManager.AVAILABLE_DENOMINATIONS.includes(item)
        ? this.validInputCash.push(item)
        : this.invalidInputCash.push(item);
    });
  }

  setInputCard(input: InputCard) {
    this.cardInput = input;
  }

  requestCardApproval() {
    // 현재 시간의 분이 짝수이면 카드 결제 성공, 홀수이면 실패로 응답
    const minute = new Date().getMinutes();
    if (minute % 2 === 0) {
      return true
    } else {
      throw new Error();
    }
  }
}

export default PaymentManager;

export type PaymentMethod = 'cash' | 'card';
