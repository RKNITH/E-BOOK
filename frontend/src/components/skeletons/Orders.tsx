import { Divider, Skeleton } from "@nextui-org/react";
import { FC } from "react";

export interface Props {
  items?: number;
}

const Orders: FC<Props> = ({ items = 3 }): JSX.Element => {
  const fakeData = new Array(items).fill("");

  return (
    <div className="lg:p-0 p-5">
      {fakeData?.map((_, index) => {
        return (
          <div key={index}>
            <Skeleton className="h-6 w-1/4 rounded-t" />
            <Divider />

            <div className="p-5 flex">
              <Skeleton className="w-24 h-32 rounded" />

              <div className="px-5  space-y-4">
                <Skeleton className="h-4 w-56 rounded" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
            <div className="flex justify-end">
              <Divider className="w-10/12" />
            </div>

            <div className="py-6 flex justify-end space-x-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;
