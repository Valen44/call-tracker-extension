import { Phone } from "lucide-react";
import { SettingsMenu } from "@/dashboard/components/settings-menu/SettingsMenu"

export const HeaderSection = () => {

    return (
        
            <header className="flex gap-2 items-center mb-6 justify-between">
                <div className="flex gap-2 items-center">
                    <div className="bg-accent-foreground rounded-2xl p-3 flex justify-center items-center">
                        <Phone className="stroke-background" />
                    </div>
                    <h1 className="text-4xl font-bold">Call Dashboard</h1>
                </div>
                <div>
                    <SettingsMenu/>
                </div>
            </header>
            )
}
