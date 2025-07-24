import React from "react"
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CircleDollarSign, PiggyBank, Calendar } from "lucide-react";

export type EarningsCardProps = {
today: number;
month: number;
year: number;
}

export const EarningsCard = ({ earnings } : { earnings: EarningsCardProps}) => {
    return (
        <section className="grid sm:grid-cols-3 gap-6 mb-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-muted-foreground">Today's Earnings</CardTitle>
                    <CardAction> <CircleDollarSign/></CardAction>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-green-700">${earnings.today.toFixed(2)}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-muted-foreground">This Month</CardTitle>
                    <CardAction> <Calendar/></CardAction>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">${earnings.month.toFixed(2)}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-muted-foreground">This Year</CardTitle>
                    <CardAction> <PiggyBank/></CardAction>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">${earnings.year.toFixed(2)}</p>
                </CardContent>
            </Card>
        </section>
    )
}
