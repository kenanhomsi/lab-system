/**
 * Patient Appointments Page
 * Server Component that composes the appointment management layers
 */

import Init from "./init";
import State from "./state";
import Observer from "./observer";
import Utils from "./utils";
import UI from "./ui";
import { mockAppointments } from "./mock-data";

/**
 * Main page component for patient appointments management
 * Follows the layered architecture pattern: Init → State → Observer → Utils → UI
 */
export default function Page() {
    return (
        <Init appointmentsList={mockAppointments}>
            <State>
                <Observer>
                    <Utils>
                        <UI />
                    </Utils>
                </Observer>
            </State>
        </Init>
    );
}
