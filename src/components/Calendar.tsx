"use client";

import { useMemo, type CSSProperties, useState } from "react";
import {
  DatePicker,
  type DatePickerType,
} from "@mantine/dates";
import {
  MantineProvider,
  Text,
  createTheme,
  type MantineColorScheme,
  Popover,
  UnstyledButton,
  Box,
} from "@mantine/core";
import { Calendar as CalendarIcon } from 'lucide-react';
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

export type CalendarValue = Date | null | [Date | null, Date | null] | Date[];

export interface CalendarProps {
  /** Calendar selection type */
  type?: DatePickerType;
  /** Controlled date value */
  value?: CalendarValue;
  /** Change handler for the selected value */
  onChange?: (value: CalendarValue) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Optional label rendered above the calendar */
  label?: string;
  /** Optional description rendered below the label */
  description?: string;
  /** Control the color scheme (defaults to light) */
  colorScheme?: MantineColorScheme;
  /** Additional className applied to the wrapper div */
  className?: string;
  /** Inline styles applied to the wrapper div */
  style?: CSSProperties;
}

const baseTheme = createTheme({
  fontFamily: "Roboto, 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  defaultRadius: "lg",
  primaryColor: "orange",
  primaryShade: { light: 6, dark: 4 },
});

const pickerStyles = {
  month: {
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    padding: "12px",
  },
  day: {
    fontWeight: 500,
  },
};

const Calendar = ({
  type = "default",
  value,
  onChange,
  minDate,
  maxDate,
  label,
  description,
  colorScheme = "light",
  className,
  style,
}: CalendarProps) => {
  const [opened, setOpened] = useState(false);

  // Convert value to Date object if it's a string
  const getDateValue = () => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (Array.isArray(value)) return value[0];
    return new Date(value);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Chọn ngày';
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateChange = (date: any) => {
    if (onChange) {
      onChange(date);
    }
    if (type === 'default') {
      setOpened(false);
    }
  };
  const memoizedTheme = useMemo(() => baseTheme, []);
  const containerClassName = ["flex flex-col gap-1", className]
    .filter(Boolean)
    .join(" ");
  const mergedStyle: CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "8px",
    ...style,
  };

  return (
    <MantineProvider theme={baseTheme} defaultColorScheme={colorScheme}>
      <Popover
        width="target"
        position="bottom"
        shadow="md"
        opened={opened}
        onChange={setOpened}
      >
        <Popover.Target>
          <Box style={style} className={className}>
            {label && (
              <Text size="sm" fw={500} mb={4}>
                {label}
              </Text>
            )}
            {description && (
              <Text size="xs" c="dimmed" mb={8}>
                {description}
              </Text>
            )}
            <UnstyledButton
              onClick={() => setOpened((o) => !o)}
              style={{
                width: '100%',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: '#9ca3af',
                },
              }}
            >
              <Text c={value ? undefined : 'dimmed'} style={{ fontSize: '14px' }}> 
                {formatDate(getDateValue())}
              </Text>
              <CalendarIcon size={18} color="#6b7280" />
            </UnstyledButton>
          </Box>
        </Popover.Target>
        <Popover.Dropdown p={0} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '8px', backgroundColor: 'white' }}>
            <DatePicker
              type={type}
              value={getDateValue()}
              onChange={handleDateChange}
              minDate={minDate}
              maxDate={maxDate}
              styles={{
                ...pickerStyles,
                calendarHeader: {
                  backgroundColor: 'white',
                },
                month: {
                  ...pickerStyles.month,
                  backgroundColor: 'white',
                },
                day: {
                  ...pickerStyles.day,
                  '&[data-selected]': {
                    backgroundColor: 'var(--mantine-color-orange-6)',
                    '&:hover': {
                      backgroundColor: 'var(--mantine-color-orange-7)',
                    },
                  },
                },
              }}
            />
          </div>
        </Popover.Dropdown>
      </Popover>
    </MantineProvider>
  );
};

export default Calendar;
