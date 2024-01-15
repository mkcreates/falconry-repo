"use client"

import { useState } from 'react'

// components
import { Dropdown, DropdownContent, DropdownItem } from '@/components/ui/Dropdown'

// icons
import { CaretDown } from '@phosphor-icons/react'

const HomeFeedsTop = ({ sort, setSort, setTimeFilter }) => {
    const [selectedTime, setSelTime] = useState(null)

    function filterTime (time) {
        /* set filter time within selected time */
        
        if (time === null) {
            setTimeFilter(null)
            setSelTime(null)
        }
        else if (time === 'day') {
            const oneDay = new Date()
            oneDay.setDate(oneDay.getDate() - 1)
            setTimeFilter(oneDay.toISOString())
            setSelTime('day')
        }
        else if (time === 'week') {
            const oneWeek = new Date()
            oneWeek.setDate(oneWeek.getDate() - 7)
            setTimeFilter(oneWeek.toISOString())
            setSelTime('week')
        }
        else if (time === 'month') {
            const oneMonth = new Date()
            oneMonth.setDate(oneMonth.getMonth() - 1)
            setTimeFilter(oneMonth.toISOString())
            setSelTime('month')
        }
    }

    return (
        <>
            <Dropdown position='left' className='mr-3' trigger='click' hideOnClick>
                <div className='default'>
                    <span>
                        {selectedTime === null && 'All'}
                        {selectedTime === 'day' && '1 Day'}
                        {selectedTime === 'week' && '1 Week'}
                        {selectedTime === 'month' && '1 Month'}
                    </span>
                    <CaretDown size={12} />
                </div>

                <DropdownContent>
                    <DropdownItem
                        onClick={() => filterTime(null)}
                        active={selectedTime === null}
                    >All</DropdownItem>

                    <DropdownItem
                        onClick={() => filterTime('day')}
                        active={selectedTime === 'day'}
                    >1 day</DropdownItem>

                    <DropdownItem
                        onClick={() => filterTime('week')}
                        active={selectedTime === 'week'}
                    >1 week</DropdownItem>

                    <DropdownItem
                        onClick={() => filterTime('month')}
                        active={selectedTime === 'month'}
                    >1 month</DropdownItem>
                </DropdownContent>
            </Dropdown>


            <Dropdown position='left' trigger='click' hideOnClick>
                <div className='default'>
                    <span>{sort === 'desc' ? 'Newest' : 'Oldest'}</span>
                    <CaretDown size={12} />
                </div>
                <DropdownContent>
                    <DropdownItem
                        onClick={() => setSort('desc')}
                        active={sort === 'desc'}
                    >Newest</DropdownItem>

                    <DropdownItem
                        onClick={() => setSort('asc')}
                        active={sort === 'asc'}
                    >Oldest</DropdownItem>
                </DropdownContent>
            </Dropdown>
        </>
    )
}
 
export default HomeFeedsTop