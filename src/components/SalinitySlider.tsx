import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Droplets, Search, ChevronLeft, ChevronRight, X, GripHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalinityPoint, getStatus } from "@/data/salinityData";

interface SalinitySliderProps {
    data: SalinityPoint[];
    selectedPoint: SalinityPoint | null;
    onPointSelect: (point: SalinityPoint) => void;
    onClearSelection: () => void;
}

const ITEMS_PER_PAGE = 4;

export function SalinitySlider({
    data,
    selectedPoint,
    onPointSelect,
    onClearSelection,
}: SalinitySliderProps) {
    const { t } = useLanguage();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [lastPageBeforeSelect, setLastPageBeforeSelect] = useState(1);

    // Filter data based on search
    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    // Calculate current items for the page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Handle selected point changes
    useEffect(() => {
        if (selectedPoint) {
            // Save current page to return later
            setLastPageBeforeSelect(currentPage);
        }
    }, [selectedPoint]); // Only run when a point is selected

    const handleBack = () => {
        onClearSelection();
        setCurrentPage(lastPageBeforeSelect);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    // Render a single Alert Card
    const AlertCard = ({ alert, isSingle = false }: { alert: SalinityPoint, isSingle?: boolean }) => {
        // Re-calculate status dynamically just to be safe
        const status = getStatus(alert.salinity);

        return (
            <Card
                className={`border-2 transition-all hover:shadow-md cursor-pointer ${status === 'danger'
                        ? 'border-destructive'
                        : status === 'warning'
                            ? 'border-accent'
                            : 'border-green-600'
                    } ${isSingle ? 'h-full' : ''}`}
                onClick={() => !isSingle && onPointSelect(alert)}
            >
                <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="font-medium text-sm line-clamp-2">{alert.name}</p>
                            <div className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-muted-foreground" />
                                <span
                                    className={`text-2xl font-bold ${status === 'danger'
                                            ? 'text-destructive'
                                            : status === 'warning'
                                                ? 'text-accent'
                                                : 'text-green-600'
                                        }`}
                                >
                                    {alert.salinity}g/L
                                </span>
                            </div>
                        </div>
                        <Badge
                            className={`border-2 border-foreground shrink-0 ${status === 'danger'
                                    ? 'bg-destructive text-destructive-foreground'
                                    : status === 'warning'
                                        ? 'bg-accent text-accent-foreground'
                                        : 'bg-green-100 text-green-700 hover:bg-green-100'
                                }`}
                        >
                            {
                                status === 'danger' ? t("alerts.danger") :
                                    status === 'warning' ? t("alerts.warning") :
                                        t("alerts.safe")
                            }
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        );
    };

    // If a point is selected, show single view
    if (selectedPoint) {
        return (
            <div className="space-y-4">
                {/* Header with Search and Back button */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleBack} className="shrink-0">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t("marketplace.search")} // Re-using marketplace search placeholder
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                // Also clear selection if user starts searching
                                if (selectedPoint) onClearSelection();
                            }}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Single Item View */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[140px]">
                    {/* Top Left: Selected Item */}
                    <AlertCard alert={selectedPoint} isSingle={true} />

                    {/* Other slots empty/placeholder to maintain layout if needed, or just show one */}
                    {/* Requirement says: "địa danh đó phải xuất hiện ở slider dưới dạng duy nhất (góc 1/4 trên - trái)" */}
                    {/* We can leave the rest empty or show a mechanism to 'return' */}
                    <div className="hidden sm:flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-muted-foreground text-sm text-center">
                        Click <span className="font-bold mx-1"> &lt; </span> to view all alerts
                    </div>
                </div>

                {/* Pagination placeholder to keep height consistent */}
                <div className="flex items-center justify-between pt-2 opacity-0 pointer-events-none">
                    <Button variant="outline" size="sm" disabled>
                        <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        1 / 1
                    </span>
                    <Button variant="outline" size="sm" disabled>
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        );
    }

    // List View (Slider)
    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t("marketplace.search")}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to page 1 on search
                    }}
                    className="pl-9"
                />
            </div>

            {/* Grid Content */}
            {filteredData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[140px]">
                    {currentItems.map((alert) => (
                        <AlertCard key={alert.id} alert={alert} />
                    ))}
                    {/* Fill empty slots to maintain grid height/layout if needed, though grid handles it well */}
                </div>
            ) : (
                <div className="h-[140px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                    <p className="text-muted-foreground">Không tìm thấy địa điểm nào</p>
                </div>
            )}

            {/* Pagination (Slider controls) */}
            <div className="flex items-center justify-between pt-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || filteredData.length === 0}
                    className="w-24 border-2"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                </Button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${currentPage === i + 1 ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                }`}
                        />
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || filteredData.length === 0}
                    className="w-24 border-2"
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
