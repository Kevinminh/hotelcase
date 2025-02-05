import { RoomGrid } from "@/components/room/room-grid"

export default function Home() {
	return (
		<main className="size-full flex-1">
			<div className="max-w-7xl mx-auto px-4 py-5 pb-20">
				<RoomGrid />
			</div>
		</main>
	)
}
