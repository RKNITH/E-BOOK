import { Skeleton } from "@nextui-org/react";
import { FC } from "react";

export interface Props {
  itemsCount?: number;
}

const Cart: FC<Props> = ({ itemsCount = 2 }): JSX.Element => {
  const dummyItems = Array(itemsCount).fill("");

  return (
    <div className="lg:p-0 p-5">
      <Skeleton className="h-4 w-1/4 rounded mb-6" />

      <div className="space-y-6">
        {dummyItems.map((_, index) => {
          return (
            <div key={index} className="flex">
              {/* Product Image */}
              <div>
                <Skeleton className="w-28 h-[185px] rounded" />
              </div>

              <div className="md:grid grid-cols-6 flex flex-col overflow-hidden">
                {/* Product Details */}
                <div className="p-5 space-y-3 col-span-5">
                  <Skeleton className="h-2 w-1/4 rounded" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-20 rounded" />
                    <Skeleton className="h-8 w-20 rounded" />
                  </div>

                  <div className="flex items-center space-x-2 md:text-2xl text-xl">
                    <Skeleton className="h-8 w-20 rounded" />
                  </div>
                </div>

                {/* Cart Control */}
                <div className="flex items-center space-x-3 col-span-1 p-5 md:p-0 md:justify-end">
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-8 w-20 rounded" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cart;
