import { Button } from "konsta/react";
import { Input } from "@components/Input";
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";
interface Data {
    name: string,
    price: number
}
export default function AddOnOption({ onAdd }: { onAdd: (data: Data) => void }) {
    const [data, setData] = useState<Data>({ name: "", price: 0 })
    return (
        <div className="flex w-full gap-3 items-center">
            <div className="grid w-full items-center grid-cols-2 gap-2">
                <Input
                    onChange={event => setData(e => ({ ...e, name: event.target.value }))}
                    name=""
                    placeholder="e.g. Regular Milk" />
                <Input
                    onChange={event => setData(e => ({ ...e, price: parseFloat(event.target.value ?? "0") }))}
                    name=""
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g. 1" />
            </div>
            <div className="flex justify-center items-center">
                <Button
                    //@ts-ignore
                    type="button"
                    disabled={!data}
                    onClick={() => data && onAdd(data)}
                    className="!w-auto mt-1">
                    <AiOutlinePlus className=" h-6 w-6" />
                </Button>
            </div>
        </div>
    )
}