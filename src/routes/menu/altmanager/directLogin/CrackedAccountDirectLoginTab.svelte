<script lang="ts">
    import Tab from "../../common/modal/Tab.svelte";
    import IconTextInput from "../../common/setting/IconTextInput.svelte";
    import ButtonSetting from "../../common/setting/ButtonSetting.svelte";
    import {
        directLoginToCrackedAccount,
        randomUsername,
    } from "../../../../integration/rest";
    import IconButton from "../../common/buttons/IconButton.svelte";
    import SwitchSetting from "../../common/setting/SwitchSetting.svelte";
    import { faker } from "@faker-js/faker";
    import SingleSelect from "../../common/setting/select/SingleSelect.svelte";

    let username = "";
    let online = false;
    let mode = "Default";

    async function login() {
        await directLoginToCrackedAccount(username, online);
    }

    async function generateRandomUsername() {
        if (mode === "Default") {
            username = await randomUsername();
        } else if (mode === "Internet") {
            username = faker.internet
                .userName()
                .substring(0, 16)
                .replace(/[^a-zA-Z0-9_]+/gi, "_");
        } else if (mode === "Cat") {
            username = faker.animal
                .cat()
                .substring(0, 16)
                .replace(/[^a-zA-Z0-9_]+/gi, "_");
        } else if (mode === "Silly") {
            username =
                faker.word.sample().substring(0, 16) +
                "_" +
                faker.word.interjection().replace(/[^a-zA-Z0-9_]+/gi, "");
        }
    }
</script>

<Tab>
    <IconTextInput
        icon="user"
        title="Username"
        pattern={"[a-zA-Z0-9_]{1,16}"}
        bind:value={username}
        maxLength={16}
    >
        <IconButton
            icon="random"
            title="Random"
            on:click={generateRandomUsername}
        />
    </IconTextInput>
    <SwitchSetting title="Use online UUID" bind:value={online} />
    <SingleSelect
        title="Generator Mode"
        options={["Default", "Internet", "Cat", "Silly"]}
        bind:value={mode}
    />
    <ButtonSetting
        title="Login"
        on:click={login}
        listenForEnter={true}
        inset={true}
    />
</Tab>
