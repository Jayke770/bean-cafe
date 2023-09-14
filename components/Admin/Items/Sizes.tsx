import { Button } from "konsta/react";
import { Input, Select } from "@components/Input";
import { AiOutlinePlus } from "react-icons/ai";
import { useCallback, useState } from "react";
interface Data {
    type: string,
    price?: number,
    stocks?: number
}
export default function SizeInput({ onAdd, sizes }: { sizes: string[], onAdd: (data: Data) => void }) {
    const [data, setData] = useState<Data>({ type: "" })
    const onAddEvent = useCallback(() => {
        if (data) {
            onAdd(data)
            setData({ type: "" })
        }
    }, [data, onAdd])
    return (
        <div className="flex flex-col lg:flex-row w-full gap-2 lg:items-center">
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-2">
                <div className="grid w-full items-center lg:grid-cols-2 gap-1 lg:gap-2">
                    <Select
                        onChange={event => setData(e => ({ ...e, type: event.target.value.toLowerCase() }))}>
                        <option>Select Size</option>
                        {sizes.map((size) => <option key={size}>{size}</option>)};
                    </Select>
                    <Input
                        onChange={event => setData(e => ({ ...e, price: parseFloat(event.target.value ?? "0") }))}
                        name=""
                        type="number"
                        inputMode="numeric"
                        value={data?.price?.toString() ?? ''}
                        placeholder="Price" />
                </div>
                <Input
                    onChange={event => setData(e => ({ ...e, stocks: parseInt(event.target.value ?? "0") }))}
                    name=""
                    value={data?.stocks?.toString() ?? ''}
                    type="number"
                    inputMode="numeric"
                    placeholder="Stocks" />
            </div>
            <div className="flex justify-center items-center">
                <Button
                    //@ts-ignore
                    type="button"
                    disabled={!data.type || (data.price ?? 0) <= 0 || (data.stocks ?? 0) <= 0}
                    onClick={onAddEvent}
                    className="lg:!w-auto lg:mt-1 z-0 k-color-brand-green ">
                    <AiOutlinePlus className=" h-6 w-6 hidden lg:block" />
                    <span className=" lg:hidden">Add</span>
                </Button>
            </div>
        </div>
    )
}