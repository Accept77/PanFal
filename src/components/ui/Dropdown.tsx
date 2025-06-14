'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cva } from 'class-variance-authority';
import { WhiteDownIcon, SortUpIcon, SortDownIcon } from '@/assets';
import { cn } from '@/utils/cn';
import CalendarOnly from '@/components/ui/CalendarOnly';

interface DropdownProps {
    options: string[];
    selected?: string;
    onSelect?: (value: string, order?: 'asc' | 'desc') => void;
    placeholder?: string;
    iconType?: 'sort' | 'arrow' | 'date';
    showPlaceholderInMenu?: boolean;
    className?: string;
    selectedDate?: Date | null | undefined;
    onDateChange?: (date: Date | null) => void;
    minDate?: Date;
    maxDate?: Date;
}

const dropdownVariants = {
    container: cva('relative w-full'),

    buttonBase: cva(
        'flex items-center w-full rounded-md text-sm transition-colors duration-200 hover:text-gray-200 hover:text-gray-200 active:text-gray-400',
        {
            variants: {
                iconType: {
                    sort: 'justify-center md:justify-between gap-1 h-9 md:px-2.5 md:py-2 ',
                    arrow: 'justify-between px-4 py-2',
                    date: 'justify-between px-4 py-2 ',
                },
            },
            defaultVariants: {
                iconType: 'arrow',
            },
        }
    ),

    text: cva('truncate', {
        variants: {
            iconType: {
                sort: 'hidden md:inline',
                arrow: '',
                date: '',
            },
        },
        defaultVariants: {
            iconType: 'arrow',
        },
    }),

    menu: cva(
        `absolute z-10 top-full mt-1 rounded-lg shadow-md bg-gray-800 text-white w-full overflow-y-auto 
     max-h-50 md:max-h-70 custom-scrollbar min-w-27.5`,
        {
            variants: {
                iconType: {
                    sort: '-left-18 md:left-0',
                    arrow: 'left-0',
                    date: 'left-0',
                },
            },
            defaultVariants: {
                iconType: 'arrow',
            },
        }
    ),

    itemText: cva(
        'w-full rounded-md cursor-pointer h-10 md:h-14 text-sm md:font-base flex items-center justify-center'
    ),

    itemInner: cva(
        'w-[calc(100%-12px)] px-3 py-2 h-8 md:h-10 rounded-md transition-colors duration-200 flex items-center',
        {
            variants: {
                state: {
                    default: 'bg-transparent',
                    hover: 'bg-gray-700',
                    selected: 'bg-gray-600',
                },
            },
            defaultVariants: {
                state: 'default',
            },
        }
    ),
};

type UseDropdownProps = {
    selected?: string;
    onSelect: (value: string, order?: 'asc' | 'desc') => void;
    placeholder?: string;
    iconType?: 'sort' | 'arrow' | 'date';
    selectedDate?: Date | null | undefined;
    onDateChange?: (date: Date | null) => void;
};

function useDropdown({
    selected,
    onSelect,
    placeholder = '',
    iconType = 'arrow',
    selectedDate,
    onDateChange,
}: UseDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeDropdown = () => {
        setIsOpen(false);
        setHovered(null);
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (value: string) => {
        if (iconType === 'sort' && value === selected) {
            const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
            setSortOrder(newOrder);
            onSelect(value, newOrder);
        } else {
            setSortOrder('desc');
            onSelect(value, 'desc');
        }
        closeDropdown();
    };

    const handleDateConfirm = (date: Date | null) => {
        onDateChange?.(date);
        closeDropdown();
    };

    const handleOptionMouseEnter = (option: string) => setHovered(option);
    const handleOptionMouseLeave = () => setHovered(null);

    const getTextColor = () => {
        if (iconType === 'date') {
            return selectedDate ? 'text-white' : 'text-gray-500';
        }
        if (!selected || selected === placeholder) return 'text-gray-500';
        return 'text-white';
    };

    const getDisplayText = () => {
        if (iconType === 'date') {
            if (selectedDate) {
                return `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;
            }
            return placeholder;
        }
        return selected || placeholder;
    };

    const getOptionState = useCallback(
        (option: string): 'default' | 'hover' | 'selected' => {
            if (selected === option) return 'selected';
            if (hovered === option) return 'hover';
            return 'default';
        },
        [selected, hovered]
    );

    return {
        isOpen,
        sortOrder,
        dropdownRef,
        textColor: getTextColor(),
        displayText: getDisplayText(),
        toggleDropdown,
        handleSelect,
        handleDateConfirm,
        handleOptionMouseEnter,
        handleOptionMouseLeave,
        getOptionState,
    };
}

export default function Dropdown({
    options,
    selected,
    onSelect,
    placeholder = '',
    iconType = 'arrow',
    showPlaceholderInMenu = true,
    className,
    selectedDate,
    onDateChange,
    minDate,
    maxDate,
}: DropdownProps) {
    const {
        isOpen,
        sortOrder,
        dropdownRef,
        textColor,
        displayText,
        toggleDropdown,
        handleSelect,
        handleDateConfirm,
        handleOptionMouseEnter,
        handleOptionMouseLeave,
        getOptionState,
    } = useDropdown({
        selected,
        onSelect: onSelect ?? (() => {}),
        placeholder,
        iconType,
        selectedDate,
        onDateChange,
    });

    const getIconComponent = () => {
        if (iconType === 'sort') {
            return sortOrder === 'desc' ? SortUpIcon : SortDownIcon;
        }
        return WhiteDownIcon;
    };

    const IconComponent = getIconComponent();

    const renderDatePicker = () => (
        <div className="absolute z-10 top-full mt-1 ml-[-60px] sm:ml-0">
            <CalendarOnly
                selectedDate={selectedDate || null}
                onChange={() => {}}
                onConfirm={handleDateConfirm}
                minDate={minDate}
                maxDate={maxDate}
            />
        </div>
    );

    const renderRegularDropdown = () => (
        <ul className={dropdownVariants.menu({ iconType })}>
            {showPlaceholderInMenu && (
                <li
                    key="__placeholder__"
                    className={dropdownVariants.itemText()}
                    onClick={() => handleSelect(placeholder)}
                    onMouseEnter={() => handleOptionMouseEnter(placeholder)}
                    onMouseLeave={handleOptionMouseLeave}
                >
                    <div
                        className={dropdownVariants.itemInner({
                            state: getOptionState(placeholder),
                        })}
                    >
                        {placeholder}
                    </div>
                </li>
            )}

            {options.map((option) => (
                <li
                    key={option}
                    className={dropdownVariants.itemText()}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => handleOptionMouseEnter(option)}
                    onMouseLeave={handleOptionMouseLeave}
                >
                    <div
                        className={dropdownVariants.itemInner({
                            state: getOptionState(option),
                        })}
                    >
                        {option}
                    </div>
                </li>
            ))}
        </ul>
    );

    return (
        <div
            ref={dropdownRef}
            className={cn(dropdownVariants.container(), className)}
        >
            <button
                className={cn(
                    dropdownVariants.buttonBase({ iconType }),
                    textColor
                )}
                onClick={toggleDropdown}
                type="button"
            >
                {iconType === 'sort' && <IconComponent className="w-6 h-6" />}

                <span className={dropdownVariants.text({ iconType })}>
                    {displayText}
                </span>

                {(iconType === 'arrow' || iconType === 'date') && (
                    <IconComponent className={cn('w-6 h-6 ml-2', textColor)} />
                )}
            </button>

            {isOpen &&
                (iconType === 'date'
                    ? renderDatePicker()
                    : renderRegularDropdown())}
        </div>
    );
}
