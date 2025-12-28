package migrations

import (
	facedes "github.com/goravel/framework/facades"
	"github.com/goravel/framework/contracts/database/schema"
)


type M20251227162749Attendance struct{}

// Signature The unique signature for the migration.
func (r *M20251227162749Attendance) Signature() string {
	return "20251227162749_attendance"
}

// Up Run the migrations.
func (r *M20251227162749Attendance) Up() error {
	return facedes.Schema().Create("attendances", func(table schema.Blueprint) {
		table.ID("id")
		table.Foreign("user_id").References("users.id")
		table.DateTime("check_in")
		table.DateTime("check_out").Nullable()
		table.String("status")
		table.TimestampsTz()
	})
}

// Down Reverse the migrations.
func (r *M20251227162749Attendance) Down() error {
	return nil
}
