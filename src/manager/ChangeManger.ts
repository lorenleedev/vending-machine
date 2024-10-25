import _ from "lodash";

interface IChangeManager {
  getChange: () => void;
  setChange: (newChange: Change[]) => void;
  isChangeCorrect: (cashSum: number, price: number, changeSum: number) => boolean;
  addInputCashToChange: (changes: number[]) => void;
  updateChangeQuantity: (cash: number, delta: number) => void;
  calculateChange: ({remainingAmount, inputCash}: CalculateChange) => number[];
  reduceChange: (changes: number[]) => void;
}

class ChangeManager implements IChangeManager {
  private change: Change[] = [];

  getChange() {
    return [...this.change];
  }

  setChange(newChange: Change[]) {
    newChange.forEach(newItem => {
      const existingItem = this.change.find(item => item.denomination === newItem.denomination);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        this.change.push({...newItem});
      }
    });
  }

  isChangeCorrect(cashSum: number, price: number, changeSum: number): boolean {
    return (cashSum - price === changeSum);
  }

  addInputCashToChange(changes: number[]) {
    changes.forEach(change => {
      this.updateChangeQuantity(change, 1);
    });
  }

  updateChangeQuantity(cash: number, delta: number) {
    this.change = this.change.map(item => {
      if (item.denomination === cash) {
        return {
          ...item,
          quantity: item.quantity + delta,
        };
      }
      return item;
    });
  }


  /**
   * 거스름돈을 계산합니다.
   * this.change가 가지고 있는 화폐중 가장 큰 단위 부터 먼저 사용합니다.
   */
  calculateChange({remainingAmount, inputCash}: CalculateChange): number[] {
    if (remainingAmount <= 0) return [];

    let tempRemainingAmount = remainingAmount;
    let copiedChange:Change[] = _.cloneDeep(this.change);
    inputCash.forEach(denomination => {
      const existingItem = copiedChange.find(item => item.denomination === denomination);
      if (existingItem) {
        existingItem.quantity += 1;
      }
    })



    const calculator = (): number[] => {
      if (remainingAmount <= 0) return [];

      const availableChange = copiedChange
        .filter(item => item.quantity > 0 && item.denomination <= tempRemainingAmount)
        .sort((a, b) => b.denomination - a.denomination);

      if (availableChange.length === 0) {
        return []; // 잔돈 부족
      }

      // 현재 남은 금액으로 사용할 수 있는 최대 화폐 단위
      const denomination = availableChange[0].denomination;

      // 잔돈 수량 업데이트
      copiedChange = copiedChange.map(item =>
        item.denomination === denomination
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

      // 남은 금액 차감
      tempRemainingAmount -= denomination;

      return [denomination, ...calculator()];
    }

    return [...calculator()];
  }


  reduceChange(changes: number[]) {
    changes.forEach(denomination => {
      const changeItem = this.change.find(item => item.denomination === denomination);
      if (changeItem && changeItem.quantity > 0) {
        changeItem.quantity -= 1;
      }
    });
  }
}

export default ChangeManager;

export type Change = {
  denomination: 100 | 500 | 1000 | 5000 | 10000;
  quantity: number;
}

type CalculateChange = {
  remainingAmount: number;
  inputCash: number[];
}