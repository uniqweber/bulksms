import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

interface Package {
    id: string;
    name: string;
    credits: number;
    price: number;
    popular: boolean;
}

interface PackageCardProps {
    pkg: Package;
    selectedPackage: Package | null;
    handlePackageSelect: (pkg: Package) => void;
}

export default function PackageCard({pkg, selectedPackage, handlePackageSelect}: PackageCardProps) {
    const isSelected = selectedPackage?.id === pkg.id;

    return (
        <Card
            className={`cursor-pointer transition-all relative ${
                isSelected ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() => handlePackageSelect(pkg)}
        >
            {pkg.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                    </span>
                </div>
            )}
            <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.credits} Credits</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${pkg.price}</div>
                <p className="text-sm text-muted-foreground mt-1">${(pkg.price / pkg.credits).toFixed(2)} per credit</p>
            </CardContent>
            <CardFooter>
                <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handlePackageSelect(pkg)}
                >
                    {isSelected ? "Selected" : "Select"}
                </Button>
            </CardFooter>
        </Card>
    );
}
