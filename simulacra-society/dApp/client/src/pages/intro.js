import React from 'react';
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion';

export default function Intro() {

    return (
        <React.Fragment>
            <motion.div key="introPage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ ease: "easeInOut", duration: 1 }}>
                <div className="wrapper">
                    <div className="menubarcontainer logoMenubarcontainer">
                        <a data-aos="zoom-in" className="logoIntro" href="/">
                            <img src="/media/icons/simulacra_society_logo.svg"/>
                        </a>
                    </div>
                    <section className="manifest-section intro-section">
                        <img className="blobs blob8Intro" src="/media/blobs/blob8.webp"/>
                        <div className="manifestdiv">
                            <h2 data-aos="fade-up" data-aos-delay="100">Manifest</h2>
                            <p data-aos="fade-up" data-aos-delay="150">
                                We were all very used to this eternal silence… <br/>
                                <span className="highlighted">A deep silence…</span> <br/><br/>
                                We adapted to everything with ease, it was easy to accept everything, and we were happy about it. 
                                We had left behind that absolute existence we felt inside. We had bowed down to the order, to everything that was asked of us. <br/>
                                Yet a voice inside us told us that this was not right, but we kept snoozing its call every night, then went to sleep in a plastic peace. 
                                Maybe that was the reason we were sleep-deprived for many days. <span className="highlighted">We were tired and knocked out</span> while we tried to make our voices heard to ourselves. We were fulfilling the tasks the world had given us. <br/><br/>
                                Perhaps <span className="highlighted">we were living in a pod...</span> The endowed ones we felt safe in. Or perhaps each of us was already in a different pod, different looking but similar. 
                                In a tiny world whose shells wrapped around us, thinking about the dangers that would never harm us. <br/><br/>
                                <span className="highlighted">Now it's time to wake up!</span> Time to leave everything behind we've been told and dictated to break down the pod and face reality… 
                                Time finds them, gets them what they deserve and celebrates their existence. <span className="highlighted">We all are heroes.</span> Brave enough to change the world, sarcastic enough to dare to perish, amusing to show here we are… 
                            </p>
                            <br/>
                            <div data-aos="fade" data-aos-delay="200" data-aos-offset="100" ><a className="medium-button" href="/home">Explore The Simulacra Society <i className="fa-solid fa-earth-americas"></i></a></div>
                        </div>
                    </section>
                </div>
            </motion.div>
        </React.Fragment>
    )
}