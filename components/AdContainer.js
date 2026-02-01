"use client";

"use client";
import { useEffect, useRef } from "react";

const AD_UNITS = {
    'banner-468-60': { key: 'd8523e896edce71030a678b5b01c9b48', height: 60, width: 468 },
    'banner-160-300': { key: '5a87c8c26702e71694ac460aaf3b5060', height: 300, width: 160 },
    'banner-320-50': { key: '7b797a103a56d0e21abaac29fc0a0780', height: 50, width: 320 },
    'banner-300-250': { key: '77ec8083e9245b502e12d0f1b8206893', height: 250, width: 300 },
    'banner-160-600': { key: '06a6b2209ab1257f1cc3c030284f0afc', height: 600, width: 160 },
    'banner-728-90': { key: 'c06cf2d2bbca0b36c8dcf20d6122a625', height: 90, width: 728 }
};

export default function AdContainer({ type = 'banner-300-250' }) {
    const adRef = useRef(null);

    useEffect(() => {
        if (!adRef.current) return;

        // For Native Banner
        if (type === 'native') {
            const containerId = 'container-409d090a58ce82ce9a29ee3a88a70092';
            if (document.getElementById(containerId)) return;

            const script = document.createElement('script');
            script.async = true;
            script.src = "//pl28623378.effectivegatecpm.com/409d090a58ce82ce9a29ee3a88a70092/invoke.js";

            const div = document.createElement('div');
            div.id = containerId;

            adRef.current.appendChild(div);
            adRef.current.appendChild(script);
            return;
        }

        const unit = AD_UNITS[type];
        if (!unit) return;

        const scriptId = `ad-script-${unit.key}`;
        if (adRef.current.querySelector(`#${scriptId}`)) return;

        const atOptions = document.createElement("script");
        atOptions.id = scriptId;
        atOptions.innerHTML = `
            atOptions = {
                'key' : '${unit.key}',
                'format' : 'iframe',
                'height' : ${unit.height},
                'width' : ${unit.width},
                'params' : {}
            };
        `;

        const invokeScript = document.createElement("script");
        invokeScript.src = `//www.highperformanceformat.com/${unit.key}/invoke.js`;

        adRef.current.appendChild(atOptions);
        adRef.current.appendChild(invokeScript);

    }, [type]);

    return (
        <div
            ref={adRef}
            className="ad-wrapper"
            style={{
                margin: '2rem auto',
                textAlign: 'center',
                minHeight: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        />
    );
}

