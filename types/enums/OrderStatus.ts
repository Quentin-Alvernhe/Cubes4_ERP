export enum OrderStatus {
  IN_PROGRESS = 1,
  ON_DELIVERY = 2,
  DELIVERED = 3,
  REGISTERED = 4,
}

export const OrderStatusList: { value: OrderStatus; label: string }[] = [
  {
    value: OrderStatus.IN_PROGRESS,
    label: "En préparation",
  },
  {
    value: OrderStatus.ON_DELIVERY,
    label: "En livraison",
  },
  {
    value: OrderStatus.DELIVERED,
    label: "Livré",
  },
  {
    value: OrderStatus.REGISTERED,
    label: "Enregistré",
  },
];
