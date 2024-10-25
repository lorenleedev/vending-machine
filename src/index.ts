import {CHANGE_PRESET, CHANGE_PRESET_FOR_NO_CHANGE, INVENTORY_PRESET, INVENTORY_PRESET_NO_PRODUCTS} from "../preset";

import VendingMachine from './VendingMachine';
import InventoryManager from "./manager/InventoryManager";
import ChangeManager from "./manager/ChangeManger";
import PaymentManager from "./manager/PaymentManager";

const inventoryManager = new InventoryManager();
const changeManager = new ChangeManager();
const paymentManager = new PaymentManager();

const vendingMachine = new VendingMachine({
  inventoryManager,
  changeManager,
  paymentManager,
});


/** 
* 발생 가능한 케이스 정리
* 상황별 CASE에 대해 주석을 해제하여 npm start로 실행하여 테스트 가능합니다.
*/ 

// case1. 사용자가 현금으로 음료 뽑기에 성공한다.
vendingMachine.setInventory(INVENTORY_PRESET);
vendingMachine.setChange(CHANGE_PRESET);
vendingMachine.getBeverageByCash([10, 100, 500, 1000, 5000, 10000]);

// case2. 사용자가 현금으로 음료 뽑기에 실패한다. (잔돈 부족)
// vendingMachine.setInventory(INVENTORY_PRESET);
// vendingMachine.setChange(CHANGE_PRESET_FOR_NO_CHANGE);
// vendingMachine.getBeverageByCash([10000]);

// case3. 사용자가 현금으로 음료 뽑기에 실패한다. (재고 부족)
// vendingMachine.setInventory(INVENTORY_PRESET_NO_PRODUCTS);
// vendingMachine.setChange(CHANGE_PRESET);
// vendingMachine.getBeverageByCash([100, 500, 5000]);

// case4. 사용자가 현금으로 음료 뽑기에 실패한다. (사용 불가능한 화폐 투입)
// vendingMachine.setInventory(INVENTORY_PRESET);
// vendingMachine.setChange(CHANGE_PRESET);
// vendingMachine.getBeverageByCash([50000, 10]);

// case5. 사용자가 카드로 음료 뽑기에 성공한다. (현재 시간의 분이 짝수인 경우 성공)
// vendingMachine.setInventory(INVENTORY_PRESET);
// vendingMachine.setChange(CHANGE_PRESET);
// vendingMachine.getBeverageByCard('card');

// case6. 사용자가 카드로 음료 뽑기에 실패한다. (현재 시간의 분이 홀수인 경우 실패)
// vendingMachine.setInventory(INVENTORY_PRESET);
// vendingMachine.setChange(CHANGE_PRESET);
// vendingMachine.getBeverageByCard('card');

// case7. 사용자가 카드로 음료 뽑기에 실패한다. (사용 불가능한 카드 투입)
// vendingMachine.setInventory(INVENTORY_PRESET);
// vendingMachine.setChange(CHANGE_PRESET);
// vendingMachine.getBeverageByCard('invalid card');

// case8. 사용자가 카드로 음료 뽑기에 실패한다. (재고 부족)
// vendingMachine.setInventory(INVENTORY_PRESET_NO_PRODUCTS);
// vendingMachine.setChange(CHANGE_PRESET);
// vendingMachine.getBeverageByCard('card');
