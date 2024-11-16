import { Divider, Skeleton } from "@nextui-org/react";

const BookDetails = () => {
  return (
    <div className="md:flex">
      <div className="">
        <div className="">
          <Skeleton className="w-48 h-80 rounded-md object-cover" />
        </div>
      </div>

      <div className="md:pt-0 pt-6 md:pl-10 flex-1">
        <Skeleton className="h-4 w-1/2 rounded" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>

        <div className="mt-3 space-x-1 flex items-center font-semibold">
          <Skeleton className="h-4 w-20 rounded" />
        </div>

        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 rounded" />
          <Skeleton className="h-4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>

        <div className="flex h-10 mt-6 items-center space-x-6">
          <Skeleton className="h-8 w-8 rounded" />

          <Divider orientation="vertical" className="h-1/2" />

          <Skeleton className="h-8 w-8 rounded" />

          <Divider orientation="vertical" className="h-1/2" />

          <Skeleton className="h-8 w-8 rounded" />

          <Divider orientation="vertical" className="h-1/2" />

          <Skeleton className="h-8 w-8 rounded" />
        </div>

        <div className="mt-6 flex items-center space-x-3">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
