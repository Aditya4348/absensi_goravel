package models

import (
	"time"
	"github.com/goravel/framework/database/orm"
)

type Attendance struct {
	orm.Model
	UserID   uint `json:"user_id"`
	CheckIn  time.Time `json:"check_in"`
	CheckOut *time.Time `json:"check_out"`
	Status   string `json:"status"`
}
