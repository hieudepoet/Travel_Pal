import React, { useMemo } from 'react';
import { TourRoute } from '../data/routes';
import { provinces, vietnamViewBox, regions } from '../data/regions';

interface RouteVisualizationProps {
    route: TourRoute;
    onProvinceClick?: (provinceId: string) => void;
    onProvinceHover?: (provinceId: string | null) => void;
}

export default function RouteVisualization({ route, onProvinceClick, onProvinceHover }: RouteVisualizationProps) {
    // Get unique province IDs from the route stops
    const routeProvinceIds = useMemo(() => {
        const ids = new Set<string>();
        route.stops.forEach(stop => {
            if (stop.provinceId) {
                ids.add(stop.provinceId);
            }
        });
        return ids;
    }, [route]);

    const regionColors = useMemo(() => {
        return regions.reduce((acc, region) => {
            acc[region.id] = region.color;
            return acc;
        }, {} as Record<string, string>);
    }, []);

    return (
        <div className="w-full h-full relative">
            <svg
                viewBox={vietnamViewBox}
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}
                preserveAspectRatio="xMidYMin meet"
            >
                <title>{route.name}</title>

                {/* Render all provinces */}
                {provinces.map((province) => {
                    const isRouteProvince = routeProvinceIds.has(province.id);
                    const regionColor = regionColors[province.regionId] || '#333';

                    return (
                        <path
                            key={province.id}
                            d={province.path}
                            fill={isRouteProvince ? '#ef4444' : regionColor}
                            fillOpacity={isRouteProvince ? 1 : 0.8}
                            stroke={isRouteProvince ? '#fff' : regionColor}
                            strokeWidth={isRouteProvince ? 1.5 : 0.5}
                            className="transition-all duration-300 ease-in-out"
                            style={{
                                pointerEvents: 'all',
                                cursor: isRouteProvince ? 'pointer' : 'default'
                            }}
                            onClick={() => {
                                if (isRouteProvince && onProvinceClick) {
                                    onProvinceClick(province.id);
                                }
                            }}
                            onMouseEnter={() => {
                                if (isRouteProvince && onProvinceHover) {
                                    onProvinceHover(province.id);
                                }
                            }}
                            onMouseLeave={() => {
                                if (isRouteProvince && onProvinceHover) {
                                    onProvinceHover(null);
                                }
                            }}
                        />
                    );
                })}
            </svg>
        </div>
    );
}
