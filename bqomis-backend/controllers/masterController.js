// # SELECT appointments WHERE branch_id AND service_id [FOR -3- BOTH KNOWN]
// -- make 10 minutes matrix callendar as variable
// -- loop through appointments updating the matrix callendar boxes

const Service = require('../models/serviceModel');
const appointmentController = require('./appointmentController');

function getAppointmentCalendar(branchName, serviceName){
    let service = Service.getByName(serviceName);
    let branch = Branch.getByName(branchName);
    let appointments = appointmentController.getAppointmentsByBranchAndService(branch.id, service.id);
    let calendar = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];

    appointments.forEach(appointment => {
        let hour = appointment.appointment_time.split(':')[0];
        let minute = appointment.appointment_time.split(':')[1];
        let tenMinutes = minute / 10;
        calendar[hour][tenMinutes] += 1;
    });

    return calendar;
}

function getAppointmentsPerHourOnService(serviceName){
    let service = Service.getByName(serviceName);
    let branches = Branch.getByService(service.id);
    let appointmentsPerHour = [0, 0, 0, 0, 0, 0, 0, 0];

    branches.forEach(branch => {
        // Create mock req and res objects
        let req = {
            query: {
                branchId: branch.id,
                serviceId: service.id
            }
        };

        let branchAppointments = appointmentController.getAppointmentsByBranchAndService(req, res);
        branchAppointments.forEach(appointment => {
            let hour = appointment.appointment_time.split(':')[0];
            appointmentsPerHour[hour] += 1;
        });
    });

    return appointmentsPerHour;
}

function getAppointmentsPerHourInDistrict(district) {
    let branches = Branch.getByDistrict(district);
    let appointmentsPerHour = [0, 0, 0, 0, 0, 0, 0, 0];

    branches.forEach(branch => {
        // Create mock req and res objects
        let req = {
            query: {
                branchId: branch.id,
                date: new Date().toISOString().split('T')[0] // Format date as YYYY-MM-DD
            }
        };

        let branchAppointments = appointmentController.getAppointmentsByBranchAndDate(req, res);
        branchAppointments.forEach(appointment => {
            let hour = appointment.appointment_time.split(':')[0];
            appointmentsPerHour[hour] += 1;
        });
    });

    return appointmentsPerHour;
}