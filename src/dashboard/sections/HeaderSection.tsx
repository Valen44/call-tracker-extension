import { Phone } from "lucide-react";
import { SettingsMenu } from "@/dashboard/components/settings-menu/SettingsMenu"
import { Button } from "@/components/ui/button";

export const HeaderSection = () => {

    return (

        <header className="flex gap-2 items-center mb-6 justify-between">
            <div className="flex gap-2 items-center">
                <div className="bg-accent-foreground rounded-2xl p-3 flex justify-center items-center">
                    <Phone className="stroke-background" />
                </div>
                <h1 className="text-4xl font-bold">Call Dashboard</h1>
            </div>
            <div className="flex gap-2 items-center">
                <a href='https://ko-fi.com/S6S31J8RFT' target='_blank'>
                    <Button variant={"outline"}>
                        <img src="https://storage.ko-fi.com/cdn/brandasset/v2/kofi_symbol.png" width={24} height={24}></img>
                        Buy me a coffee
                    </Button>
                </a>
                <SettingsMenu/>
            </div>
        </header>
    )
}
