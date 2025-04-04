import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQ() {
    return (
        <Accordion type="single" collapsible className="w-full p-8">
            <AccordionItem value="item-1">
                <AccordionTrigger>What is scistuai.com?</AccordionTrigger>
                <AccordionContent>
                    scistuai.com is a cutting-edge platform offering advanced AI tools to empower students and researchers.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>How does scistuai.com work?</AccordionTrigger>
                <AccordionContent>
                    Our platform integrates machine learning and AI-driven analysis to provide personalized academic support and insights.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Is my data secure on scistuai.com?</AccordionTrigger>
                <AccordionContent>
                    Absolutely. We use robust encryption and security protocols to ensure your data remains private and secure.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>What benefits does scistuai.com offer?</AccordionTrigger>
                <AccordionContent>
                    From tailored research assistance to expert-curated academic content, scistuai.com is designed to boost your educational growth.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger>How can I get started with scistuai.com?</AccordionTrigger>
                <AccordionContent>
                    Simply sign up for an account and explore our intuitive tools to enhance your learning experience.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
