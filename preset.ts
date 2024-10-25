import {Inventory} from "./src/manager/InventoryManager";
import {Change} from "./src/manager/ChangeManger";

export const INVENTORY_PRESET: Inventory[] = [
    {
      product: 'coke',
      price: 1100,
      quantity: 3
    },
    {
      product: 'water',
      price: 600,
      quantity: 3
    },
    {
      product: 'coffee',
      price: 700,
      quantity: 3
    }
];

export const CHANGE_PRESET: Change[] = [
  {
    denomination: 10000,
    quantity: 10
  },
  {
    denomination: 5000,
    quantity: 10
  },
  {
    denomination: 1000,
    quantity: 10
  },
  {
    denomination: 500,
    quantity: 10
  },
  {
    denomination: 100,
    quantity: 10
  },
];

export const CHANGE_PRESET_FOR_NO_CHANGE: Change[] = [
  {
    denomination: 10000,
    quantity: 10
  },
  {
    denomination: 5000,
    quantity: 0
  },
  {
    denomination: 1000,
    quantity: 0
  },
  {
    denomination: 500,
    quantity: 10
  },
  {
    denomination: 100,
    quantity: 0
  }
];

export const INVENTORY_PRESET_NO_PRODUCTS: Inventory[] = [
  {
    product: 'coke',
    price: 1100,
    quantity: 0
  },
  {
    product: 'water',
    price: 600,
    quantity: 0
  },
  {
    product: 'coffee',
    price: 700,
    quantity: 0
  }
];
