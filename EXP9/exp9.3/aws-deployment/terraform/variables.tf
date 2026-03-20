variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "fullstack-app"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "app_port" {
  description = "Port the application listens on"
  type        = number
  default     = 8080
}

variable "task_cpu" {
  description = "CPU units for ECS task (1024 = 1 vCPU)"
  type        = number
  default     = 256
}

variable "task_memory" {
  description = "Memory in MB for ECS task"
  type        = number
  default     = 512
}

variable "min_capacity" {
  description = "Minimum number of ECS tasks (auto-scaling)"
  type        = number
  default     = 2   # Minimum 2 for high availability across 2 AZs
}

variable "max_capacity" {
  description = "Maximum number of ECS tasks (auto-scaling)"
  type        = number
  default     = 4
}
