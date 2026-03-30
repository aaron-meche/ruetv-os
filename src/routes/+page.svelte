<!-- created by Aaron Meche -->
<script>
    import { onMount } from "svelte";
    import Logo from "./Logo.svelte";
    import { goto } from "$app/navigation";
    import Home from "./app/Home.svelte";

    let sys, app
    let appClient = false
    let loadProgress = 0

    function enterSystemMode(mode) {
        // 0 ==> Enter System Boot
        if (mode == 1) {
            console.log("Client")
            appClient = true
            sys.style.left = "-100vw"
            sys.style.opacity = "0"
            app.style.left = "0"
            app.style.opacity = "1"
        }
        else {
            console.log("Boot")
            appClient = false
            sys.style.left = "0"
            sys.style.opacity = "1"
            app.style.left = "100vw"
            app.style.opacity = "0"
        }
    }

    onMount(() => {
        enterSystemMode(0)
        setTimeout(() => { enterSystemMode(1) }, 1200)
    })

    function handleKeydown(event) {
        let code = event.code
        console.log(code)

        if (code == "Backquote") {
            enterSystemMode(!appClient)
        }
    }
</script>

<!--  -->

<svelte:window on:keydown={handleKeydown} />

<!-- Boot Screen -->
<div class="boot screen" bind:this={sys}>
    <Logo />
</div>
<!-- Client Screen -->
<div class="client screen" bind:this={app}>
    <Home />
</div>

<!--  -->

<style lang="rue">
    .screen{
        position: fixed;
        height: 100vh;
        width: 100vw;
        transition: opacity 800ms, left 800ms;
        opacity: 0;
    }

    .screen.boot{
        display: grid;
        align-items: center;
        justify-content: center;
    }

    .screen.client{ 
        left: 100vw;
        background: white;
    }

    .progress{
        height: 0.4rem;
        width: 24rem;
        margin-top: 1.8rem;
        background: rgb(40 40 40);
        outline: solid 1pt rgb(80 80 80);
        border-radius: 100vh;
        overflow: hidden;

        .value{
            height: 100%;
            max-width: 100%;
            background: rgb(80 80 80);
            transition: width 600ms cubic-bezier(0.86, 0, 0.07, 1);
        }
    }

</style>