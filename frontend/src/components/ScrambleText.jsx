import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ScrambleText = ({
    sequences = [],
    className = '',
    showCursor = false,
    onComplete = null,
    replayOnClick = true,
    as: Component = 'span'
}) => {
    const containerRef = useRef(null);
    const timelineRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || sequences.length === 0) return;

        const container = containerRef.current;
        const textElements = container.querySelectorAll('[data-scramble-id]');

        // Main timeline
        const tl = gsap.timeline({
            id: "text-scramble",
            defaults: { ease: "back.out(2.7)" },
            onComplete: () => {
                if (onComplete) onComplete();
            }
        });

        // Cursor timeline (if enabled)
        let cursorTl = null;
        if (showCursor) {
            const cursor = container.querySelector('[data-cursor]');
            if (cursor) {
                cursorTl = gsap.timeline({ repeat: -1 });
                cursorTl
                    .to(cursor, {
                        opacity: 0,
                        duration: 1.0,
                        ease: "none",
                        delay: 0.2
                    })
                    .to(cursor, {
                        opacity: 1,
                        duration: 1.0,
                        ease: "none",
                        delay: 0.2
                    });
            }
        }

        // Build timeline from sequences
        sequences.forEach((seq, index) => {
            const element = textElements[index];
            if (!element) return;

            // Using the custom scramble implementation
            tl.to(element, {
                duration: seq.duration || 1,
                onUpdate: function () {
                    const progress = this.progress();
                    element.textContent = scrambleText(
                        seq.text,
                        progress,
                        seq.chars || 'lowerCase',
                        seq.speed || 2.0
                    );
                },
                onComplete: function () {
                    element.textContent = seq.text;
                }
            }, seq.position || ">");
        });

        // Add cursor timeline at the end
        if (cursorTl) {
            tl.add(cursorTl);
        }

        timelineRef.current = tl;

        // Replay on click
        const handleClick = () => {
            if (replayOnClick && timelineRef.current) {
                timelineRef.current.play(0);
            }
        };

        if (replayOnClick) {
            container.addEventListener('click', handleClick);
            return () => {
                container.removeEventListener('click', handleClick);
                tl.kill();
                if (cursorTl) cursorTl.kill();
            };
        }

        return () => {
            tl.kill();
            if (cursorTl) cursorTl.kill();
        };
    }, [sequences, showCursor, onComplete, replayOnClick]);

    // Helper function to scramble text
    const scrambleText = (finalText, progress, charSet, speed = 5.5) => {
        const chars = getCharSet(charSet);
        let result = '';
        const revealCount = Math.floor(finalText.length * progress);
        const scrambleIntensity = 1 - (progress * speed);

        for (let i = 0; i < finalText.length; i++) {
            if (i < revealCount) {
                result += finalText[i];
            } else if (Math.random() > scrambleIntensity) {
                result += chars[Math.floor(Math.random() * chars.length)];
            } else {
                result += finalText[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
            }
        }
        return result;
    };

    const getCharSet = (charSet) => {
        if (typeof charSet === 'string' && charSet.length > 20) {
            return charSet;
        }

        switch (charSet) {
            case 'upperCase':
                return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            case 'lowerCase':
                return 'abcdefghijklmnopqrstuvwxyz';
            case 'upperAndLowerCase':
                return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            default:
                return charSet;
        }
    };

    return (
        <Component ref={containerRef} >
            {sequences.map((seq, index) => (
                <React.Fragment key={index}>
                    <span
                        data-scramble-id={index}
                        className={className}
                    >
                        {seq.initialText || ''}
                    </span>
                </React.Fragment>
            ))}
            {showCursor && <span data-cursor>|</span>}
        </Component>
    );
};

export default ScrambleText;