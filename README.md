<div align="center">

# Storybook Library VSD
[![Report Issue on Jira](https://img.shields.io/badge/Report%20Issues-Jira-0052CC?style=flat&logo=jira-software)](https://temple-cis-projects-in-cs.atlassian.net/jira/software/c/projects/DT/issues)
[![Deploy Docs](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml)
[![Documentation Website Link](https://img.shields.io/badge/-Documentation%20Website-brightgreen)](https://applebaumian.github.io/tu-cis-4398-docs-template/)


</div>


## Keywords

Section #, as well as any words that quickly give your peers insights into the application like programming language, development platform, type of application, etc.

## Project Abstract

This project proposes a progressive web application designed to support Augmentative and Alternative Communication (AAC) users through the creation of interactive Visual Scene Displays (VSDs) for storybook reading. The application allows caregivers and educators to upload storybook pages, annotate images, and generate story-relevant vocabulary with customizable text-to-speech voices. Progress on integrating interaction, vocabulary support, and usage logging will help the system to improve engagement, comprehension, and communication during both individual and group reading activities. This application provides an accessible and flexible tool that supports language development and inclusive literacy experiences for AAC users.

## High Level Requirement

### Customization
- The caretaker can open VSD in edit mode
- The caretaker can select and store objects with the book
- The caretaker can add comments to pages
- The caretaker can save new learned words as custom buttons
### Language Accessibility
- The system allows for text to speech for reading books
- The system allows changes in language for text to speech
### Book Management
- System allows caretakers to upload storybooks and save them to their personal library
- System allows users to open existing books saved to their personal library
- Users can import and export saved stories
- Users can share books between accounts
### Reading Experience
- The child can click on an image to hear the definition
- The child can navigate between pages by flipping forward and backward
### Core Account
- System allows for caretaker to create account
- System allows users to log in and out
- System maintains user sessions unless user logs out or closes the app

## Conceptual Design

The frontend of the application will be built using JavaScript, React, HTML, and CSS. React will be used to create reusable UI components and manage application state, while JavaScript, HTML, and CSS will support user interactions, layout, and accessibility features. The HTML Canvas API will be used to enable interactive drawing, annotation, and manipulation of VSDs directly on storybook pages. The backend will be developed using Supabase to support user authentication, data storage, and management of storybooks, VSD collections, and vocabulary data. Supabase will also handle secure storage and retrieval of user-created content, including images, annotations, and text-to-speech settings. The frontend will be hosted using Render, while Supabase will provide backend hosting and database services to support saving, editing, and reopening storybook VSDs across sessions.

## Background

Similar products include Proloquo2Go and TouchChat. These are both AAC applications that support communication through symbol-based grids and text-to-speech, allowing users to express basic needs and ideas. However, these tools are closed-source and are not specifically designed to support shared storybook reading or the creation of interactive, context-rich Visual Scene Displays (VSDs). As a result, caregivers often need to manually adapt materials or rely on static visuals that limit engagement and flexibility during reading activities. Other AAC tools and research-based approaches emphasize the benefits of using visual scenes and personalized content to support language development and comprehension. Building on these ideas, the VSD Storybook application focuses on combining story-based AAC support with interactive and customizable VSDs. Similar to existing AAC tools, the application supports text-to-speech and vocabulary access, but it extends these features by enabling users to upload storybooks, annotate pages, and organize multiple VSDs into reusable libraries. This application aims to provide a more engaging and effective AAC experience by centering the design around storybook interaction and personalization for both individual and group reading contexts.

## Required Resources

Internet Access

Laptop or mobile device

Headphones (optional)

## Collaborators

<div align="center">

[//]: # (Replace with your collaborators)
[Michael Zavinouski](https://github.com/tul39810) • [Shivi Choudhary](https://github.com/shivichoudhary) • [Roland Guy](https://github.com/RolandG369) • [Lian Welch](https://github.com/LianW9) • [Rayhona Nasimova](https://github.com/nasimovars) • [Nick Lolli](https://github.com/NickLolli)

</div>
