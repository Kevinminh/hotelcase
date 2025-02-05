import { PageWrapper } from "@/components/global/page-wrapper"
import { RoomGrid, RoomGridSkeleton } from "@/components/room/room-grid"
import { Suspense } from "react"

export default function Home() {
	return (
		<PageWrapper className="pb-20">
			<Suspense fallback={<RoomGridSkeleton />}>
				<RoomGrid />
			</Suspense>
		</PageWrapper>
	)
}
