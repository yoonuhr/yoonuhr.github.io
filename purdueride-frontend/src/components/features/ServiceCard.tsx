import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    linkTo: string;
    className?: string;
}

const ServiceCard = ({ title, description, icon, linkTo, className = '' }: ServiceCardProps) => {
    return (
        <Link to={linkTo} className={`block ${className}`}>
            <Card className="h-full transition-transform hover:translate-y-[-4px]">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 text-purdue-gold">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
                    <p className="text-gray-600">{description}</p>

                    <div className="mt-4 text-purdue-gold font-medium">
                        Details
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default ServiceCard;