import React from 'react';

function FAQ ({faq, index, toggleFAQ}) {
    return (
        <>
            <button className={"faqaccordion " + (faq.open ? 'faqactive' : '')} onClick={() => toggleFAQ(index)}>{faq.question}</button>
            <div className={"faqpanel " + (faq.open ? 'faqpanelactive' : '')}>
                <p>
                    {faq.answer}
                </p>
            </div>
        </>
    );
};

export default FAQ;


