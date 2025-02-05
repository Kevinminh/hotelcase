"use client"

import { createParser, useQueryStates } from "nuqs"
import type { DateRange as DayPickerDateRange } from "react-day-picker"

type DateRange = {
	from: Date
	to: Date
}

const EMPTY_RANGE = {
	from: new Date(),
	to: new Date(),
}

const parseDateRange = createParser<DateRange>({
	parse: (value: string | null): DateRange => {
		if (!value) return EMPTY_RANGE
		const [from, to] = value.split("|")
		if (!from || !to) return EMPTY_RANGE
		return {
			from: new Date(from),
			to: new Date(to),
		}
	},
	serialize: (value: DateRange): string => {
		if (!value?.from || !value?.to) return ""
		return `${value.from.toISOString()}|${value.to.toISOString()}`
	},
}).withDefault(EMPTY_RANGE)

interface UseDateRangePickerReturn {
	range: DateRange
	setRange: (newRange: DayPickerDateRange | undefined) => void
}

export function useDateRangePicker(): UseDateRangePickerReturn {
	const [{ dateRange }, setDateRange] = useQueryStates(
		{
			dateRange: parseDateRange,
		},
		{
			history: "replace",
		}
	)

	return {
		range: dateRange,
		setRange: (newRange: DayPickerDateRange | undefined) => {
			if (newRange?.from && newRange?.to) {
				setDateRange({ dateRange: { from: newRange.from, to: newRange.to } })
			}
		},
	}
}
