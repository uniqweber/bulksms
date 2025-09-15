"use client";

import AdminDashboardLayout from "@/components/admin/layout/dashboard-layout";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Textarea} from "@/components/ui/textarea";
import {AlertTriangle, Loader2, Save} from "lucide-react";
import Link from "next/link";
import {useState} from "react";

// ✅ Type for Pricing Tier
type PricingTier = {
    id: string;
    name: string;
    price: number;
    credits: number;
};

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState<"general" | "pricing" | "payment">("general");
    const [saving, setSaving] = useState<boolean>(false);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

    // General settings state
    const [siteName, setSiteName] = useState<string>("BulkSMS");
    const [siteDescription, setSiteDescription] = useState<string>("Send bulk SMS messages with ease");
    const [contactEmail, setContactEmail] = useState<string>("support@bulksms.com");
    const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

    // Pricing settings state
    const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
        {id: "starter", name: "Starter", price: 25, credits: 500},
        {id: "business", name: "Business", price: 100, credits: 2500},
        {id: "enterprise", name: "Enterprise", price: 400, credits: 10000},
    ]);

    // Payment settings state
    const [acceptBitcoin, setAcceptBitcoin] = useState<boolean>(true);
    const [bitcoinAddress, setBitcoinAddress] = useState<string>("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh");
    const [acceptEthereum, setAcceptEthereum] = useState<boolean>(true);
    const [ethereumAddress, setEthereumAddress] = useState<string>("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
    const [acceptUSDC, setAcceptUSDC] = useState<boolean>(true);
    const [usdcAddress, setUsdcAddress] = useState<string>("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");

    const handleSaveSettings = async (): Promise<void> => {
        setSaving(true);
        setSaveSuccess(false);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSaveSuccess(true);

            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setSaving(false);
        }
    };

    const updatePricingTier = (id: string, field: keyof PricingTier, value: string | number) => {
        setPricingTiers((prevTiers) => prevTiers.map((tier) => (tier.id === id ? {...tier, [field]: value} : tier)));
    };

    return (
        <AdminDashboardLayout>
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">System Settings</h1>
                        <p className="text-muted-foreground">Configure your application settings</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Button asChild variant="outline">
                            <Link href="/admin">Back to Dashboard</Link>
                        </Button>
                    </div>
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "general" | "pricing" | "payment")}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-3 mb-8">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="pricing">Pricing</TabsTrigger>
                        <TabsTrigger value="payment">Payment</TabsTrigger>
                    </TabsList>

                    {/* General Settings */}
                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>General Settings</CardTitle>
                                <CardDescription>Configure basic settings for your application.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="site-name">Site Name</Label>
                                    <Input
                                        id="site-name"
                                        value={siteName}
                                        onChange={(e) => setSiteName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="site-description">Site Description</Label>
                                    <Textarea
                                        id="site-description"
                                        value={siteDescription}
                                        onChange={(e) => setSiteDescription(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact-email">Contact Email</Label>
                                    <Input
                                        id="contact-email"
                                        type="email"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="maintenance-mode"
                                        checked={maintenanceMode}
                                        onCheckedChange={setMaintenanceMode}
                                    />
                                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                                </div>
                                {maintenanceMode && (
                                    <Alert>
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Warning</AlertTitle>
                                        <AlertDescription>
                                            Enabling maintenance mode will make the site inaccessible to regular users.
                                            Only administrators will be able to access the site.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Pricing Settings */}
                    <TabsContent value="pricing">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing Settings</CardTitle>
                                <CardDescription>Configure pricing tiers and credit packages.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {pricingTiers.map((tier) => (
                                        <div key={tier.id} className="border rounded-lg p-4">
                                            <h3 className="font-medium mb-4">{tier.name} Package</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`${tier.id}-name`}>Package Name</Label>
                                                    <Input
                                                        id={`${tier.id}-name`}
                                                        value={tier.name}
                                                        onChange={(e) =>
                                                            updatePricingTier(tier.id, "name", e.target.value)
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`${tier.id}-price`}>Price (USD)</Label>
                                                    <Input
                                                        id={`${tier.id}-price`}
                                                        type="number"
                                                        value={tier.price}
                                                        onChange={(e) =>
                                                            updatePricingTier(tier.id, "price", Number(e.target.value))
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`${tier.id}-credits`}>Credits</Label>
                                                    <Input
                                                        id={`${tier.id}-credits`}
                                                        type="number"
                                                        value={tier.credits}
                                                        onChange={(e) =>
                                                            updatePricingTier(
                                                                tier.id,
                                                                "credits",
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Payment Settings */}
                    <TabsContent value="payment">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Settings</CardTitle>
                                <CardDescription>Configure payment methods and wallet addresses.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Bitcoin */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Switch
                                            id="accept-bitcoin"
                                            checked={acceptBitcoin}
                                            onCheckedChange={setAcceptBitcoin}
                                        />
                                        <Label htmlFor="accept-bitcoin">Accept Bitcoin</Label>
                                    </div>
                                    {acceptBitcoin && (
                                        <div className="space-y-2">
                                            <Label htmlFor="bitcoin-address">Bitcoin Wallet Address</Label>
                                            <Input
                                                id="bitcoin-address"
                                                value={bitcoinAddress}
                                                onChange={(e) => setBitcoinAddress(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Ethereum */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Switch
                                            id="accept-ethereum"
                                            checked={acceptEthereum}
                                            onCheckedChange={setAcceptEthereum}
                                        />
                                        <Label htmlFor="accept-ethereum">Accept Ethereum</Label>
                                    </div>
                                    {acceptEthereum && (
                                        <div className="space-y-2">
                                            <Label htmlFor="ethereum-address">Ethereum Wallet Address</Label>
                                            <Input
                                                id="ethereum-address"
                                                value={ethereumAddress}
                                                onChange={(e) => setEthereumAddress(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* USDC */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Switch id="accept-usdc" checked={acceptUSDC} onCheckedChange={setAcceptUSDC} />
                                        <Label htmlFor="accept-usdc">Accept USDC</Label>
                                    </div>
                                    {acceptUSDC && (
                                        <div className="space-y-2">
                                            <Label htmlFor="usdc-address">USDC Wallet Address</Label>
                                            <Input
                                                id="usdc-address"
                                                value={usdcAddress}
                                                onChange={(e) => setUsdcAddress(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="mt-8 flex items-center justify-end space-x-4">
                    {saveSuccess && <div className="text-green-600 font-medium">Settings saved successfully!</div>}
                    <Button onClick={handleSaveSettings} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Settings
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
