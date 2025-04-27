import React from 'react';
import { Lightbulb, CheckCircle, AlertTriangle, ChevronRight, BookOpen, BrainCircuit } from 'lucide-react';
import { cn } from "@/lib/utils" // Utility for combining class names

const getSuggestionIcon = (type) => {
    switch (type) {
        case 'general':
            return <Lightbulb className="w-5 h-5 text-yellow-400" />;
        case 'specific':
            return <CheckCircle className="w-5 h-5 text-green-400" />;
        case 'keyword':
            return <Search className="w-5 h-5 text-blue-400" />;
        default:
            return <Lightbulb className="w-5 h-5 text-yellow-400" />;
    }
};

const getSuggestionColor = (priority) => {
    switch (priority) {
        case 1:
            return 'text-red-400';   // High priority - Red
        case 2:
            return 'text-yellow-400'; // Medium priority - Yellow
        case 3:
            return 'text-green-400';  // Low priority - Green
        default:
            return 'text-gray-400'; // Default color
    }
};

const ContentOptimizationSuggestions = ({ suggestion }) => {
    if (!suggestion) {
        return (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-gray-400">
                No content optimization suggestions available.
            </div>
        );
    }

    // Improved parsing and splitting of the AI-generated text
    const sections = suggestion.text.split(/(To enhance|Create new sections|Emphasize how|Throughout, prioritize)/g).filter(Boolean);

    const structuredSections = [];
    for (let i = 0; i < sections.length; i += 2) {
        structuredSections.push({
            title: sections[i]?.trim(),
            content: sections[i + 1]?.trim() || '',
        });
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6" />
                Content Optimization Strategy
            </h3>
            <div
                className={cn(
                    "bg-gray-800/80 border rounded-xl p-6",
                    "transition-all duration-300",
                    "shadow-lg border-purple-500/20"
                )}
            >
                {structuredSections.map((section, index) => {
                  let icon = <BookOpen className="w-6 h-6 text-gray-400 mb-2" />;
                    if(section.title.includes("enhance")){
                        icon = <BrainCircuit className="w-6 h-6 text-blue-400 mb-2"/>
                    }
                    else if (section.title.includes("Create")){
                        icon = <ListChecks className="w-6 h-6 text-purple-400 mb-2"/>
                    }
                    else if (section.title.includes("Emphasize")){
                        icon = <TrendingUp className="w-6 h-6 text-green-400 mb-2"/>
                    }
                    else if (section.title.includes("Throughout")){
                         icon = <Lightbulb className="w-6 h-6 text-yellow-400 mb-2"/>;
                    }
                    return (
                        <div key={index} className="mb-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                {icon}
                                {section.title}
                            </h4>
                            <p className="text-gray-300 leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    );
                })}
                <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
                    <span className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 cursor-pointer">
                        Learn More <ChevronRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ContentOptimizationSuggestions;
