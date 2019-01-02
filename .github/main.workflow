workflow "New workflow" {
  on = "push"
  resolves = ["zeit"]
}

action "zeit" {
  uses = "actions/zeit-now@9fe84d5"
  secrets = ["ZEIT_TOKEN"]
}
