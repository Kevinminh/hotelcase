"use client"

import { createParser, useQueryStates } from "nuqs"
import { addDays } from "date-fns"
import type { DateRange as DayPickerDateRange } from "react-day-picker"

type DateRange = {
	from: Date
	to: Date
}

const getDefaultRange = (): DateRange => {
	const today = new Date()
	return {
		from: today,
		to: addDays(today, 1),
	}
}

const parseDateRange = createParser<DateRange>({
	parse: (value: string | null): DateRange => {
		if (!value) return getDefaultRange()
		const [from, to] = value.split("|")
		if (!from || !to) return getDefaultRange()
		return {
			from: new Date(from),
			to: new Date(to),
		}
	},
	serialize: (value: DateRange): string => {
		if (!value?.from || !value?.to) return ""
		return `${value.from.toISOString()}|${value.to.toISOString()}`
	},
}).withDefault(getDefaultRange())

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
			if (newRange?.from && newRange.to) {
				setDateRange({ dateRange: { from: newRange.from, to: newRange.to } })
			}
		},
	}
}
