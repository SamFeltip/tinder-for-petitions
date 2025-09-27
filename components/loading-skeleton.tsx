"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton() {
  return (
    <Card
      className="absolute w-80 h-[500px] overflow-hidden"
      style={{
        left: "50%",
        top: "50%",
        marginLeft: "-160px",
        marginTop: "-250px",
        zIndex: 1,
      }}
    >
      <div className="relative h-full">
        <div className="h-3/4">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="absolute top-4 left-4 right-4">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        <div className="h-1/4 p-4 flex items-center justify-center gap-6">
          <Skeleton className="rounded-full w-14 h-14" />
          <Skeleton className="rounded-full w-14 h-14" />
        </div>
      </div>
    </Card>
  )
}
