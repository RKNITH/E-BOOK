import { Divider, Skeleton } from "@nextui-org/react";
import { FC } from "react";

export interface Props {}

const Payment: FC<Props> = (): JSX.Element => {
  return (
    <div className="lg:p-0 p-5">
      <Skeleton className="h-4 w-1/4 rounded" />

      <div className="p-5 flex flex-col items-center">
        <div className="w-96">
          <div className="flex">
            <Skeleton className="w-28 h-40 rounded object-cover" />

            <div className="p-3 flex-1 space-y-2">
              <Skeleton className="w-1/2 h-4 rounded" />

              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-20 h-4 rounded" />
            </div>
          </div>
          <Divider className="my-3" />

          <div className="flex">
            <Skeleton className="w-28 h-40 rounded object-cover" />

            <div className="p-3 flex-1 space-y-2">
              <Skeleton className="w-1/2 h-4 rounded" />

              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-20 h-4 rounded" />
            </div>
          </div>
          <Divider className="my-3" />

          <div className="w-96 flex items-center justify-between">
            <Skeleton className="w-32 h-4 rounded" />
            <Skeleton className="w-32 h-4 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
