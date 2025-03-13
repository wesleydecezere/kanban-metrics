import { ProjectsV2ItemEditedEvent } from "@octokit/webhooks-types";

export const titleEdited: ProjectsV2ItemEditedEvent = {
  action: "edited",
  projects_v2_item: {
    id: 83146550,
    node_id: "PVTI_lADOCuv1Ac4ApFNDzgT0tzY",
    project_node_id: "PVT_kwDOCuv1Ac4ApFND",
    content_node_id: "I_kwDOM4lqYc6Z76w9",
    content_type: "Issue",
    creator: {
      login: "wesleydecezere",
      id: 75259871,
      node_id: "MDQ6VXNlcjc1MjU5ODcx",
      avatar_url: "https://avatars.githubusercontent.com/u/75259871?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/wesleydecezere",
      html_url: "https://github.com/wesleydecezere",
      followers_url: "https://api.github.com/users/wesleydecezere/followers",
      following_url:
        "https://api.github.com/users/wesleydecezere/following{/other_user}",
      gists_url: "https://api.github.com/users/wesleydecezere/gists{/gist_id}",
      starred_url:
        "https://api.github.com/users/wesleydecezere/starred{/owner}{/repo}",
      subscriptions_url:
        "https://api.github.com/users/wesleydecezere/subscriptions",
      organizations_url: "https://api.github.com/users/wesleydecezere/orgs",
      repos_url: "https://api.github.com/users/wesleydecezere/repos",
      events_url:
        "https://api.github.com/users/wesleydecezere/events{/privacy}",
      received_events_url:
        "https://api.github.com/users/wesleydecezere/received_events",
      type: "User",
      site_admin: false,
    },
    created_at: "2024-10-12T06:51:02Z",
    updated_at: "2024-10-12T06:55:45Z",
    archived_at: null,
  },
  changes: {
    field_value: {
      field_node_id: "PVTF_lADOCuv1Ac4ApFNDzggjDrY",
      // @ts-expect-error "@octokit/webhooks-types" package is not fully up to date
      field_type: "title",
      field_name: "Title",
      project_number: 1,
    },
  },
  organization: {
    login: "decezere",
    id: 183235841,
    node_id: "O_kgDOCuv1AQ",
    url: "https://api.github.com/orgs/decezere",
    repos_url: "https://api.github.com/orgs/decezere/repos",
    events_url: "https://api.github.com/orgs/decezere/events",
    hooks_url: "https://api.github.com/orgs/decezere/hooks",
    issues_url: "https://api.github.com/orgs/decezere/issues",
    members_url: "https://api.github.com/orgs/decezere/members{/member}",
    public_members_url:
      "https://api.github.com/orgs/decezere/public_members{/member}",
    avatar_url: "https://avatars.githubusercontent.com/u/183235841?v=4",
    description: null,
  },
  sender: {
    login: "ghost",
    id: 10137,
    node_id: "MDQ6VXNlcjEwMTM3",
    avatar_url: "https://avatars.githubusercontent.com/u/10137?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/ghost",
    html_url: "https://github.com/ghost",
    followers_url: "https://api.github.com/users/ghost/followers",
    following_url: "https://api.github.com/users/ghost/following{/other_user}",
    gists_url: "https://api.github.com/users/ghost/gists{/gist_id}",
    starred_url: "https://api.github.com/users/ghost/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/ghost/subscriptions",
    organizations_url: "https://api.github.com/users/ghost/orgs",
    repos_url: "https://api.github.com/users/ghost/repos",
    events_url: "https://api.github.com/users/ghost/events{/privacy}",
    received_events_url: "https://api.github.com/users/ghost/received_events",
    type: "User",
    site_admin: false,
  },
};
