# Steps to Create Your Pull Request

Here are the commands you need to run in your terminal to create a pull request.

### Step 1: Stage Your Changes

This command adds all the files you've changed to the staging area, preparing them for a commit.

```bash
git add .
```

### Step 2: Commit Your Changes

This command saves your staged changes into your local repository's history. The commit message clearly describes the new feature.

```bash
git commit -m "feat: Implement user registration page"
```

### Step 3: Push Your Branch to Your Fork

This command uploads your new `feature/signup-page` branch and all of its commits to your forked repository on GitHub.

```bash
git push origin feature/signup-page
```

### Step 4: Open the Pull Request on GitHub

After you run the `git push` command, you will see a link in the terminal output that you can copy and paste into your browser.

Alternatively, you can:
1.  Go to the original repository on GitHub that you forked from.
2.  You should see a yellow banner with a message saying "**feature/signup-page** had recent pushes."
3.  Click the **"Compare & pull request"** button.
4.  This will take you to the "Open a pull request" page. The base repository should be the original project, and the head repository should be your fork.
5.  Copy the content from the `PR_DESCRIPTION.md` file I created for you and paste it into the description box.
6.  Click **"Create pull request"**.

That's it! Your pull request will be created.
