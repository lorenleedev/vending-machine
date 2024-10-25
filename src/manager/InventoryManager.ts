import {PaymentMethod} from "./PaymentManager";

interface IInventoryManager {
  getInventory: () => void;
  setInventory: (newInventory: Inventory[]) => void;
  getProductPrice: (product: string) => number;
  getAvailableProducts: (paymentInfo: PaymentInfo) => Inventory[];
  reduceInventory: (product: string) => void;
}

class InventoryManager implements IInventoryManager {
  private inventory: Inventory[] = [];

  getInventory() {
    return [...this.inventory];
  }

  setInventory(newInventory: Inventory[]) {
    newInventory.forEach(newItem => {
      const existingItem = this.inventory.find(item => item.product === newItem.product);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        this.inventory.push({...newItem});
      }
    });
  }

  getProductPrice(product: string) {
    const foundItem = this.inventory.find(item => item.product === product);
    return foundItem ? foundItem.price : 0;
  }

  getAvailableProducts({paymentMethod, cashAmount = 0}: PaymentInfo) {
    const availableProducts = this.inventory.filter(item => item.quantity > 0);

    return paymentMethod === "card" ? availableProducts : availableProducts.filter(item => item.price <= cashAmount);
  }

  reduceInventory(product: string) {
    this.inventory = this.inventory.map(item => {
      if (item.product === product) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item;
    })
  }
}

export default InventoryManager;

export type Inventory = {
  product: string;
  price: number;
  quantity: number;
}

type PaymentInfo = {
  paymentMethod: PaymentMethod;
  cashAmount?: number;
}
