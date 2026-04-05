import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DataTableSkeletonProps = {
  columns?: number;
  rows?: number;
};

export function DataTableSkeleton({ columns = 5, rows = 6 }: DataTableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-muted/50">
          {Array.from({ length: columns }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, ri) => (
          <TableRow key={ri}>
            {Array.from({ length: columns }).map((_, ci) => (
              <TableCell key={ci}>
                <Skeleton className="h-4 w-full max-w-[140px]" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
