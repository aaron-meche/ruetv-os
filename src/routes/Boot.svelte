<!-- created by Aaron Meche -->
<script>

    import { time, date, result, error, cmd } from "$lib/data"
    import { onMount } from "svelte";

    let timeString = null
    let dateString = null
    let currResult = null
    let currError = null
    let currCmd = null
    time.subscribe(val => {
        timeString = val
    })    
    date.subscribe(val => {
        dateString = val
    })
    result.subscribe(val => {
        currResult = val
    })
    error.subscribe(err => {
        currError = err
    })
    cmd.subscribe(val => {
        currCmd = val
    })

</script>

<!--  -->

<div class="logo">
    <img src="logo-circle.png" alt="">
    <div class="text">
        <div class="logo-title">
            rueTV OS
        </div>
    </div>
</div>

<div class="top-time-display">
    <div style="font-size: 3.6rem; font-weight: 600;">{timeString}</div>
    <div style="font-size: 1.8rem; font-weight: 400;">{dateString}</div>
</div>

<div class="bottom-module">
    <div class="notif-stack">
        {#if currError}
            {#each currError as err}
                <div class="error notif">
                    {err}
                </div>
            {/each}
        {/if}
        {#if currResult}
            {#each currResult as result}
                <div class="result notif">
                    {result}
                </div>
            {/each}
        {/if}
        {#if currCmd}
            <div class="notif">
                {currCmd}
            </div>
        {/if}

    </div>
</div>

<!--  -->

<style lang="rue">
    .logo{
        display: grid;
        justify-items: center;
        gap: 1.2rem;

        .text{
            text-align: center;
        }

        .logo-title{
            font-size: 2.4rem;
            font-weight: 600;
        }

        img{
            height: 8rem;
            width: 8rem;
            background: rgb(40 40 40);
            outline: solid 0.2rem rgb(80 80 80);
            box-shadow: 0 0 4.8rem 0 rgb(40 40 40);
            border-radius: 100vh;
        }
    }

    .top-time-display{
        position: absolute;
        width: 100vw;
        top: 0;
        font-size: 1.2rem;
        font-weight: 500;
        text-align: center;
        padding-block: 2.4rem;
    }

    .bottom-module{
        position: absolute;
        bottom: 0;
        padding-block: 2.4rem;
        width: 100vw;
    }

    .notif-stack{
        display: grid;
        gap: 1.2rem;

        .result.notif{ font-weight: 600; box-shadow: inset 0 0 0.8rem rgb(0, 0, 0, 0.5); }
        .error.notif{ font-weight: 500; box-shadow: inset 0 0 0.8rem rgb(255, 0, 0, 0.5); color: var(--warning) }
        .notif{
            width: fit-content;
            margin: auto;
            padding: 0.8rem 1.6rem;
            color: white;
            background: rgb(20 20 20);
            outline: solid 1pt rgb(40 40 40);
            border-radius: 100vh;
        }
    }
</style>