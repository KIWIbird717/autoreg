import { useMemo, useRef, useState } from "react";
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash/debounce';
import { Select, Spin } from 'antd';

export interface DebounceSelectProps<TValue = any>
  extends Omit<SelectProps<TValue | TValue[]>, 'options' | 'children'> {
  fetchOptions: TValue[]
  debounceTimeout?: number
}

export const DebounceSelect = <TValue extends { key?: React.Key; label: string; value: string | number } = any,>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<TValue>) => {
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState<TValue[]>([])
  const fetchRef = useRef(0)

  const debounceFetcher = useMemo(() => {


    const loadOptions = (value: string) => {
      fetchRef.current += 1
      setFetching(true)
      setOptions(fetchOptions)
      setFetching(false)
      // fetchOptions(value).then((newOptions) => {
      //   if (fetchId !== fetchRef.current) {
      //     // for fetch callback order
      //     return
      //   }

      //   setOptions(newOptions)
      //   setFetching(false)
      // })
    }

    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  )
}