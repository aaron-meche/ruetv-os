<!-- created by Aaron Meche -->
<script>

    import { error, cmd } from "$lib/data"

    let currError = null
    let currCmd = null
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
        {#if currError}
            {#each currError as err}
                <div class="error-output">
                    {err}
                </div>
            {/each}
        {/if}
        {#if currCmd}
            <div class="cmd-input">
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

        .error-output{
            font-size: 1.2rem;
            font-weight: 500;
            color: var(--warning);
        }

        .cmd-input{
            width: 75vw;
            margin-top: 1.2rem;
            padding: 1.2rem 0;
            font-family: 'Courier New', Courier, monospace;
            background: rgb(20 20 20);
            outline: solid 1pt rgb(40 40 40);
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

    .cmd{
        position: fixed;
        bottom: 0;
        left: 0;
    }
</style>