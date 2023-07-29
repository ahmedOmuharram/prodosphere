import React from 'react';
import SoundMixerObject from './SoundMixerObject';

function SoundMixer () {
    return (
      <>
        <p className="mt-2" style={{ fontSize: "18px", color: "white" }}>Ambient Sounds</p>
        <SoundMixerObject text="Rain" file="https://st2.asoftmurmur.com/assets/p/content/rain/main-rain.mp4"/>
        <SoundMixerObject text="Thunder" file="https://st2.asoftmurmur.com/assets/p/content/thunder/main-thunder.mp4"/>
        <SoundMixerObject text="Waves" file="https://st3.asoftmurmur.com/assets/p/content/waves/glue-waves.mp4"/>
        <SoundMixerObject text="Wind" file="https://st2.asoftmurmur.com/assets/p/content/wind/glue-wind.mp4"/>
        <SoundMixerObject text="Fire" file="https://st2.asoftmurmur.com/assets/p/content/fire/glue-fire.mp4"/>
        <SoundMixerObject text="Birds" file="https://st3.asoftmurmur.com/assets/p/content/birds/glue-birds.mp4"/>
        <SoundMixerObject text="Crickets" file="https://st3.asoftmurmur.com/assets/p/content/crickets/glue-crickets.mp4"/>
        <SoundMixerObject text="Coffee shop" file="https://st3.asoftmurmur.com/assets/p/content/people/glue-people.mp4"/>
        <SoundMixerObject text="Singing bowl" file="https://st1.asoftmurmur.com/assets/p/content/sbowl/glue-sbowl.mp4"/>
        <SoundMixerObject text="White noise" file="https://st3.asoftmurmur.com/assets/p/content/whitenoise/glue-whitenoise.mp4"/>
        <div className="mt-3"/>
        <p style={{color: "white", fontSize: "10px"}}>Sounds from <a style={{color: "white", textDecoration: "none"}}href="https://asoftmurmur.com" target="_blank">asoftmurmur.com</a></p>
      </>
    )
}

export default SoundMixer;
