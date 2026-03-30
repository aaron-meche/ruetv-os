<!-- Clock.svelte -->
<!-- created by Aaron Meche -->
<script>
    import { onMount, onDestroy } from "svelte";

    let hours = "";
    let minutes = "";
    let interval;

    function updateTime() {
        const now = new Date();
        let h = now.getHours();
        let m = now.getMinutes();

        // 12-hour, no AM/PM
        if (h === 0) h = 12;
        else if (h > 12) h -= 12;

        hours = String(h);
        minutes = String(m).padStart(2, "0");
    }

    onMount(() => {
        updateTime();
        interval = setInterval(updateTime, 1000);
    });

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

<div class="clock">
    <span class="hours">{hours}</span>
    <span class="colon">:</span>
    <span class="minutes">{minutes}</span>
</div>

<style lang="rue">
    .clock {
        display: flex;
        align-items: baseline;
        gap: 0.05em;
        font-family: "Courier New", Courier, monospace;
        font-size: 7rem;
        font-weight: 300;
        letter-spacing: -0.03em;
        color: rgb(240 240 240);
        line-height: 1;
        text-shadow: 0 0 4rem rgba(255 255 255 / 0.08);
        user-select: none;
    }

    .colon {
        opacity: 0.4;
        font-size: 6rem;
        position: relative;
        top: -0.05em;
        animation: blink 1s step-start infinite;
    }

    .hours {
        min-width: 2ch;
        text-align: right;
    }

    .minutes {
        min-width: 2ch;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 0.4;
        }
        50% {
            opacity: 0.1;
        }
    }
</style>
