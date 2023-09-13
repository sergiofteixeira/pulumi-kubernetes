"use strict";
const pulumi = require("@pulumi/pulumi");
const k8s = require("@pulumi/kubernetes")

const appName = "nginx";

const provider = new k8s.Provider("render", {
    renderYamlToDirectory: "dist"
});

const deployment = new k8s.apps.v1.Deployment(appName, {
    metadata: {
        labels: {
            app: appName,
            cluster: "local",
        },
        name: appName,
    },
    spec: {
        replicas: 1,
        selector: {
            matchLabels: {
                app: appName,
            },
        },
        template: {
            metadata: {
                labels: {
                    app: appName,
                    cluster: "local"
                },
            },
            spec: {
                containers: [
                    {
                        image: "nginx:latest",
                        name: appName,
                        ports: [{
                            containerPort: 80,
                        }]
                    }
                ]
            },
        }
    },
}, { provider });

const service = new k8s.core.v1.Service(appName, {
    metadata: {
        labels: {
            app: appName,
            cluster: "local",
        },
        name: appName,
    },
    spec: {
        ports: [{
            port: 80,
            protocol: "TCP",
            targetPort: 80,
        }],
        sessionAffinity: "ClientIP",
        selector: {
            app: appName,
        },
    },
}, { provider });

