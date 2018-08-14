import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Ngx-Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// Model
import { IndicatorGroup } from '../../../shared/models/indicatorGroup';
import { Months } from '../../../shared/models/months';

// Service
import { IndicatorGroupService } from '../../../services/indicator-group/indicator-group.service';
import { IndicatorService } from '../../../services/indicator/indicator.service';

// Importa libreria PDF
import * as jsPDF from 'jspdf';
import { modalConfigDefaults } from 'ngx-bootstrap/modal/modal-options.class';
import { Indicator } from '../../../shared/models/indicator';

// Importa libreria Excel
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'app-reportgenerator',
  templateUrl: './reportgenerator.component.html',
  styleUrls: ['./reportgenerator.component.css']
})
export class ReportgeneratorComponent implements OnInit {

  // modalRef: BsModalRef;
  @Input() modalRef: BsModalRef;

  @Input() indicatorGroups;

  setTitlePeriod: string; // variable utilizada para cambiar el titulo del resultado del periodo seleccionado
  setContentDropdown = 'Ninguno'; // variable utilizada para cambiar el contenido del dropdown resultado del periodo seleccionado
  options: string[] = []; // arreglo que se adecua al periodo que se selecciona

  selectedYear: number;
  selectedYearText: String; // cambia la opcion del dropdown
  years: number[] = []; // List of years from 2018 to CurrentYear
  baseYear: number;

  selectedMonthTex = 'Seleccione Mes'; // Default selection (string shown in the dropdown)
  selectedMonth: number; // The current selected month (number), depends of the name of the month in spanish.
  months: number[] = []; // List of the months from 0 (January) to the current month (defined in ngOnInit)
  monthsOfTheYear: string[] = []; // List with the list names of the months (in spanish) of the selected year (defined in ngOnInit)
  isMonthDisabled = false;
  // tslint:disable-next-line:max-line-length
  Months: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  selectMonth = 'Ninguno';

  public indicators: Indicator[] = [];
  public isClicked: Boolean = false;
  public indicator$: Observable<Indicator>;
  private idIndicator: number;

  selectedReport = 'PDF';

  selectedPeriod = 'Ninguno';
  periods: string[] = ['Ninguno', 'Trimestral', 'Mensual', 'Semanal']; // List of periods

  selectedTrimester = 'Ninguno';
  trimester: string[] = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Trimestre 4']; // List of Trimester

  selectedWeek = 'Semana 1';
  weeks: string[] = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']; // List of Trimester

  // tslint:disable-next-line:max-line-length
  img = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBcRXhpZgAATU0AKgAAAAgABAMCAAIAAAAWAAAAPlEQAAEAAAABAQAAAFERAAQAAAABAAAuI1ESAAQAAAABAAAuIwAAAABQaG90b3Nob3AgSUNDIHByb2ZpbGUA/+IMWElDQ19QUk9GSUxFAAEBAAAMSExpbm8CEAAAbW50clJHQiBYWVogB84AAgAJAAYAMQAAYWNzcE1TRlQAAAAASUVDIHNSR0IAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1IUCAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARY3BydAAAAVAAAAAzZGVzYwAAAYQAAABsd3RwdAAAAfAAAAAUYmtwdAAAAgQAAAAUclhZWgAAAhgAAAAUZ1hZWgAAAiwAAAAUYlhZWgAAAkAAAAAUZG1uZAAAAlQAAABwZG1kZAAAAsQAAACIdnVlZAAAA0wAAACGdmlldwAAA9QAAAAkbHVtaQAAA/gAAAAUbWVhcwAABAwAAAAkdGVjaAAABDAAAAAMclRSQwAABDwAAAgMZ1RSQwAABDwAAAgMYlRSQwAABDwAAAgMdGV4dAAAAABDb3B5cmlnaHQgKGMpIDE5OTggSGV3bGV0dC1QYWNrYXJkIENvbXBhbnkAAGRlc2MAAAAAAAAAEnNSR0IgSUVDNjE5NjYtMi4xAAAAAAAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAADzUQABAAAAARbMWFlaIAAAAAAAAAAAAAAAAAAAAABYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9kZXNjAAAAAAAAABZJRUMgaHR0cDovL3d3dy5pZWMuY2gAAAAAAAAAAAAAABZJRUMgaHR0cDovL3d3dy5pZWMuY2gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAuSUVDIDYxOTY2LTIuMSBEZWZhdWx0IFJHQiBjb2xvdXIgc3BhY2UgLSBzUkdCAAAAAAAAAAAAAAAuSUVDIDYxOTY2LTIuMSBEZWZhdWx0IFJHQiBjb2xvdXIgc3BhY2UgLSBzUkdCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGRlc2MAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAACxSZWZlcmVuY2UgVmlld2luZyBDb25kaXRpb24gaW4gSUVDNjE5NjYtMi4xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2aWV3AAAAAAATpP4AFF8uABDPFAAD7cwABBMLAANcngAAAAFYWVogAAAAAABMCVYAUAAAAFcf521lYXMAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAKPAAAAAnNpZyAAAAAAQ1JUIGN1cnYAAAAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANwA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAIsAkACVAJoAnwCkAKkArgCyALcAvADBAMYAywDQANUA2wDgAOUA6wDwAPYA+wEBAQcBDQETARkBHwElASsBMgE4AT4BRQFMAVIBWQFgAWcBbgF1AXwBgwGLAZIBmgGhAakBsQG5AcEByQHRAdkB4QHpAfIB+gIDAgwCFAIdAiYCLwI4AkECSwJUAl0CZwJxAnoChAKOApgCogKsArYCwQLLAtUC4ALrAvUDAAMLAxYDIQMtAzgDQwNPA1oDZgNyA34DigOWA6IDrgO6A8cD0wPgA+wD+QQGBBMEIAQtBDsESARVBGMEcQR+BIwEmgSoBLYExATTBOEE8AT+BQ0FHAUrBToFSQVYBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBysHPQdPB2EHdAeGB5kHrAe/B9IH5Qf4CAsIHwgyCEYIWghuCIIIlgiqCL4I0gjnCPsJEAklCToJTwlkCXkJjwmkCboJzwnlCfsKEQonCj0KVApqCoEKmAquCsUK3ArzCwsLIgs5C1ELaQuAC5gLsAvIC+EL+QwSDCoMQwxcDHUMjgynDMAM2QzzDQ0NJg1ADVoNdA2ODakNww3eDfgOEw4uDkkOZA5/DpsOtg7SDu4PCQ8lD0EPXg96D5YPsw/PD+wQCRAmEEMQYRB+EJsQuRDXEPURExExEU8RbRGMEaoRyRHoEgcSJhJFEmQShBKjEsMS4xMDEyMTQxNjE4MTpBPFE+UUBhQnFEkUahSLFK0UzhTwFRIVNBVWFXgVmxW9FeAWAxYmFkkWbBaPFrIW1hb6Fx0XQRdlF4kXrhfSF/cYGxhAGGUYihivGNUY+hkgGUUZaxmRGbcZ3RoEGioaURp3Gp4axRrsGxQbOxtjG4obshvaHAIcKhxSHHscoxzMHPUdHh1HHXAdmR3DHeweFh5AHmoelB6+HukfEx8+H2kflB+/H+ogFSBBIGwgmCDEIPAhHCFIIXUhoSHOIfsiJyJVIoIiryLdIwojOCNmI5QjwiPwJB8kTSR8JKsk2iUJJTglaCWXJccl9yYnJlcmhya3JugnGCdJJ3onqyfcKA0oPyhxKKIo1CkGKTgpaymdKdAqAio1KmgqmyrPKwIrNitpK50r0SwFLDksbiyiLNctDC1BLXYtqy3hLhYuTC6CLrcu7i8kL1ovkS/HL/4wNTBsMKQw2zESMUoxgjG6MfIyKjJjMpsy1DMNM0YzfzO4M/E0KzRlNJ402DUTNU01hzXCNf02NzZyNq426TckN2A3nDfXOBQ4UDiMOMg5BTlCOX85vDn5OjY6dDqyOu87LTtrO6o76DwnPGU8pDzjPSI9YT2hPeA+ID5gPqA+4D8hP2E/oj/iQCNAZECmQOdBKUFqQaxB7kIwQnJCtUL3QzpDfUPARANER0SKRM5FEkVVRZpF3kYiRmdGq0bwRzVHe0fASAVIS0iRSNdJHUljSalJ8Eo3Sn1KxEsMS1NLmkviTCpMcky6TQJNSk2TTdxOJU5uTrdPAE9JT5NP3VAnUHFQu1EGUVBRm1HmUjFSfFLHUxNTX1OqU/ZUQlSPVNtVKFV1VcJWD1ZcVqlW91dEV5JX4FgvWH1Yy1kaWWlZuFoHWlZaplr1W0VblVvlXDVchlzWXSddeF3JXhpebF69Xw9fYV+zYAVgV2CqYPxhT2GiYfViSWKcYvBjQ2OXY+tkQGSUZOllPWWSZedmPWaSZuhnPWeTZ+loP2iWaOxpQ2maafFqSGqfavdrT2una/9sV2yvbQhtYG25bhJua27Ebx5veG/RcCtwhnDgcTpxlXHwcktypnMBc11zuHQUdHB0zHUodYV14XY+dpt2+HdWd7N4EXhueMx5KnmJeed6RnqlewR7Y3vCfCF8gXzhfUF9oX4BfmJ+wn8jf4R/5YBHgKiBCoFrgc2CMIKSgvSDV4O6hB2EgITjhUeFq4YOhnKG14c7h5+IBIhpiM6JM4mZif6KZIrKizCLlov8jGOMyo0xjZiN/45mjs6PNo+ekAaQbpDWkT+RqJIRknqS45NNk7aUIJSKlPSVX5XJljSWn5cKl3WX4JhMmLiZJJmQmfyaaJrVm0Kbr5wcnImc951kndKeQJ6unx2fi5/6oGmg2KFHobaiJqKWowajdqPmpFakx6U4pammGqaLpv2nbqfgqFKoxKk3qamqHKqPqwKrdavprFys0K1ErbiuLa6hrxavi7AAsHWw6rFgsdayS7LCszizrrQltJy1E7WKtgG2ebbwt2i34LhZuNG5SrnCuju6tbsuu6e8IbybvRW9j74KvoS+/796v/XAcMDswWfB48JfwtvDWMPUxFHEzsVLxcjGRsbDx0HHv8g9yLzJOsm5yjjKt8s2y7bMNcy1zTXNtc42zrbPN8+40DnQutE80b7SP9LB00TTxtRJ1MvVTtXR1lXW2Ndc1+DYZNjo2WzZ8dp22vvbgNwF3IrdEN2W3hzeot8p36/gNuC94UThzOJT4tvjY+Pr5HPk/OWE5g3mlucf56noMui86Ubp0Opb6uXrcOv77IbtEe2c7ijutO9A78zwWPDl8XLx//KM8xnzp/Q09ML1UPXe9m32+/eK+Bn4qPk4+cf6V/rn+3f8B/yY/Sn9uv5L/tz/bf///9sAQwACAQECAQECAgICAgICAgMFAwMDAwMGBAQDBQcGBwcHBgcHCAkLCQgICggHBwoNCgoLDAwMDAcJDg8NDA4LDAwM/9sAQwECAgIDAwMGAwMGDAgHCAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAcADIAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACisfxr42s/A+kG5ujukbKwwqfnmb0Ht6nt+QNjwz4ms/FukR3tlJ5kUnBB4aNu6sOxH/1xkEGvGhxFlk8zlk0a8XiYxU3Tv7yi+tv03SabVmm9vq9RU/bWfLe1zQooor2TEKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACszxh4pg8G+HrjULj5lhGFQHBkY8BR9T37DJ7Vp1xPxtv10jT9IvJrX7da2t8JJIC+0O3lvtycHgHnpg9O9fI8eZ5Vyjh/FZjQkoShHSTTkoczUedxSbkoX53FJtqLSWp1YGiqteNN6pvbv5fPY4LWdB1fxhcjVtavdO0tboZgF7P5XydhGnJwPfBPXnOal0CHWPhnK2rWE1jq2mjC3f2OfzIyvo4xlSOcNjjvwSDefRv7Q1abbpbeLNbYB724afy7O1YjIiQ5AbAI6njt3AIbdfDmoSXMemyeHdYs4mme0kn32mqwD/WIGORux2GQOD15H8S0+H/YY7+2IyqQrKbf1jmqyqKor815uj9VnPfmw8arbV6KqTno/sfb80PZOzVvhsrW9L8yXaVvOyR6tomsweIdIt722bdBcoHUnqPY+46H3FWq5P4LN5vgZZEh+z28tzO9vFu3eVGZGwue+DkZ711lf3Nwjm9TNcjwmZVrc1anCbtdJuUU243s+V7xuk7NXVz4zFUlSrSprZNoKKKK+iOcKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCrrmuWfhrR7rUNQurexsbKJpri4ncJHCijLMzHgADvXwP8fv26fGv7RHxAj8K/DA6vp+lzymC0/s9Wj1LVmHJkLDDQxgKWAUqQoZnP8KH/AAUz+N3jDV/iK/gu9sbnQvC9ntuLePdka5jkTsw4KK3Cx/wsMt820L4r+zP4t13wb8Z9JuPDuit4j1K6Etn/AGWu4NfRSRssqBl+aMhMt5g4TbuPygg/yn4meKFbG5xHhrAynRoqahVnFNVJapNRVuZJeSvPs1pL5/HY5zqexjdK9n3/AK/Mnj8LfEzw38ZbHwzJceJ9G8YahcxQwrJqEsMrNIcK/mq3KdcuCR8rehr638AfH7U/AVvpfhP4seI/D3ibw94maay0zxZpdxuS1u7dxHJBdMVUAq5XEpGOMuWBZk8++OPg7w/LB4C1zxVrtx8CvE3h21Gm6ZpDJL4hkS0tJSbadXhPmKQzMN0uQ+3joS3R3em+EP2mvgV4mm8XfE6w8Q2Phc/a7TxJF4Qn0dtEnkA3x84juRMdhaFR5jM4wctEV8/Icjq5bUxmDw9XnlJNxhVq01CdNxUpwrUpyhUV4c0XKVJNXjK8IptzhXUw9RypStJarVLz1Taa+7z0PbofC1zpmsQ+HdXWGext4JZNNiDm3g1OYsCPMYfxDJGO2B1By0V7okepTanp631tZ+D9GcXl1e3EoaLTdkeZUjlc4Cj5iSeFAycdGwP2FNU0/Xvh3Nott44b4i6T4bniFheS+H7vTX04gEiASzEiXaNuFB3IrbTlGQDhf2/ND0H4jePfCvwr13xrdaH4f1qzudRg8FWmn3GnP8QLuIO6WZ1pyLaJfM8vdD/rCXVmI3xlfoco8J8FjcHSxDkvq0nqueMqrpqKhHDOtBtTop9pO8YQUYRq80z6jH8WToYL61CKdR2STlFR527Xve179k5O7STdomT8bf297bSdA1jVfD/k+KP2f4fD8ulX/iH4ea1HdeIvDt5KAqTTxMY2tQFDiOQM21isjsMhR8L/APBRn4B+Mf2SPjDY+KvDfiT4gDwj4ojhutN1iXX5riSzvXj86WzS8WXfOqKVdJyF3qzKC7QyOew+HXw70r9mf/gqv4D8JeCYZm0/xppltYeMPCdxfpqyaR9thl+36RcTJlblbdVSbccjhc5A5s/GHw7o6f8ABHm3tbq+Ojr4d8WXB8MO9/ZyN49EWqy2AmKMpuc2tllBtZQEiU4MYUL+v1EqlCVKyj7NOyWijy20WitGzVlo01bVtI/nnOsZiM2w2IljNKtLnkmnpGVPlbSdk+WSmtJWlGSs25SjFbv/AATp/wCC0GueB/Edn4P+M2sS614avGWG08S3Q3XmkucAC6cf66A95WzIhJLM6/c/WC0u4tQtIri3kjmgmQSRyRsGSRSMhgRwQRzkV/MvX6Yf8EHv2n/iN4h1i++Glxpd94i+H+i2xni1Z3x/wjDEEx2xdv8AWRyEEJEMumCQPLB2dWRZzUc1hq15X2e7Xk/Lz6em3V4dceYiVaGU49ufNpCWrafaXVrz+z193Vfp5RRRX2R+7BRRX5y/tqf8FrPF37L37UvjDwDp3g7wvqVl4bnt4orq6u5o5phJawzksF4GDKRx2ArkxmOpYWCnWdk3bvr/AEjxc84gwWUUFiMdJxi3yqyb1s308kz9GqK/JdP+DiHx7KPl+Hvg1vpfXBpp/wCDibx0D/yIHgv/AMD7ivO/1iwP8z+5ny//ABFHh7/n6/8AwCX+R+tVFfnL8T/+C13i7wF+zD8I/HkHgnw1d33xHbXlurZryZYbP+z7yK3TYQCW3rISc9COK+7/AIEfEKf4t/A/wb4rureGzufE2hWWrTQRMWjgee3SVkUnkgFyATzgV34bMKNeThSeqSe3RpNfgz6TK+JMBmFaVDCyblGMZPRr3ZpSjv3TWnQ6uiivi/8A4KR/8FYrv9hr4waF4P0nwZb+JLu70yPWr6a8v2tIxA800SxRbUY7yYJCXI2r8vyuSduuKxVLD0/aVXZf12OzNs4wmWYd4rGS5YJpXs3q9tEmz7QornvhJ8RrT4w/Cnwz4usIbi2sfFOk2ur20NwAs0UdxCkqq4BIDBXAOCec10NbRkpK62O+nUjUgpwd01dejCiivn3/AIKTftj6t+w/8BtP8XaPoun67dXuuQaU1veTPFGqSQzyFwVBOQYgMe5qK1aNKm6k9kc2YY6jgsPPFYh2hBXbtfT0R9BUV5F+wj+0df8A7W37K3hj4gapptno99rz3qyWlrI0kUXkXs9sMM3JysIY57k167To1I1IKpDZpNejNMHiqeJoQxNF3jNKS9Grr8GcL+0F+z7oP7RvgOXRNbh2yLmSyvY1Hn2EuOHQ+nYqeGHB7EfnbNonir9g/wCPkL6tpcF40cc0KFy6Wus2kiGNzFIPmU7WHT5kbGQRw36mVk+M/Aui/EXQ5NM17StP1jT5DuNveQLNGGGQGAYHDDJww5HY1+aceeGtDPatPMsHP2GMpNONS107apTXW3R622aa0MMZgVVanB2kuv8Amfl54i/aEsfGHxp8Ha9eeGLW28M+DorHT7XRI52usWNtIWEbSy8yv8zctgHCg9yfoXUNFvP+CiWoeHdJ0vVfFM3gvw3e3d7rGvalbRWvnPM4aK0t4o/3ck0MZZPMYHYHLH7wST3Kw/YC+EOm6qLyPwXaPKrbtk15czQ/9+nkKEe23Fes6No1n4d0uCx0+0trGxtUEcNvbxLFFCo6KqqAAPYCvkOF/CnOYSxFLiHE050a0lKcaaac+VpqLdoKMfdWii7K8YuKk78uHy2qrqtJWe6XX8rf1axQ8B+A9I+GPhGx0LQbGHTdK06Py4IIxwB1JJPLMxJJYkliSSSSTXM/tLfs0+Ef2tPhHqHgvxppwvtKvsSRSphbnT51BCXEDkHZKm44OCCGZWDIzK3fUV+8Rw1KNJUIxSglZJKySWlktrW6Hp1sNSrUnQqxTg1ZprRrtY/MHTf2DL/9jfx1rXg/4V6bdr8QNR8OT3B+KXjS8g03QvD9i22OdtNS38xxdFnWN3kXzIdyt/q5fn8Z/wCCmfxe8M/DXwhov7O/w9s4bfwn4PuLbVdRf+1pb+a21AW7RSWLgloY5EdpJZjbsY2lmOQsiy7v2X8SeHNP8Y+HdQ0jVrK11LS9VtpLO8tLmISw3UMilJI3RuGVlJBB4IJFfPEH/BIL9nG31sagvwzsfOVtwiOp3xtfp5Bn8rHttx7V4OLyWpyOnhbJPv0XZWT36tu7sk+lvzTOuA8Q8NLCZO4QjLR811yx3cY2i2+Z25pN8zSSbaSt+R/7EP7Dni39uP4mLpOhxyaf4fsZAda16SItbabHwSi9BJOwPyxA553NtUE1+537PX7PXhX9l74V6d4P8H6cun6Tp43MzHdPeTHG+eZ8AvK5AJY+gAAUKo6Pwb4K0b4deGrXRfD+k6boej2KlLax0+1S2trcEkkJGgCqMkngdSa067crymng433k93+i/rU9vg/gnDZHTc789aW8rW07RXRd+r69EiiiivXPtgrmdd+Cng3xRq82oan4R8M6jfXJBmubrS4JppSAFG52Uk4AA5PQAV01FTKKe6M6lKFRWmk15q5+Pf8AwX68E6L4D+O3gm30PR9L0WCbw3NJJHY2kdurt9oYbiEABOO5r9KPgV8AvAeofBDwbcXHgnwjNNNodk8kj6PbszsbdCSSU5JPevzr/wCDiX/k4HwN/wBixN/6UvX6hfs/f8kF8E/9gCw/9J46+fy+nH+0MQrfy/kfmPDOHpPifM4uKsuSysux+cH/AAcL+GNN8JR/BLT9J0+x0uxhi8QGO2tIFghjLPprNhFAAyxJOBySTWZ8MP8AgvvF8GvhZ4P8H2PwuXVo/DGhWGkvdXXiYWcl08FvHEzLEttIFUspIyxJGMgHiug/4OOjjUvgv/1x1/8AnplfZX7HHwI8D3n7FPw4s5vBvhWaz1jwlpk9/A+kwNHfSS2kTSvKpTEjOzMWLZLEknJNcvscRPMq0cNPk0j0T6LTU8v6jmVfivH08rrqg1Gnd8qldckLKz0XqU/2GP8Ago74H/bq02+t9GjvNB8U6RGJr7Q79lMyxEhfPhdTtmh3EKWGGUld6pvTd4T/AMFiv2mPh98DfH/ge08afBLw78VbiaxuL+0utQ1T7E9mI5FBhwLeXzI2JBKMdhI5U9a+Zf2IfDVr8If+C4h8M+Hlk0/Q7PxJ4j0qG2WQsq2iWd7JHCSSSyq0UWMkn92pJJ5rrv8Ag4x/5K78O/8AsAX3/o6OlWzCtUy2c525oy5W7Jp2a1s0117E47ijH4jhTEYmty+2pVFTb5Yyi7SjryyTXXturqx+g3x4/a20H9l79lmD4k63pGoSaWttZbNN0tY5JVe42LHGpcxptUuAWOMKCQCcKfhDxL/wccalHqWNO+Fek21qG4F74kZpZFzwcLbgKcdvmx6mvb/+Csn/ACiatf8Ad0H/ANGwVJ/wQn8K6XN+w2122m6e11fa7fx3Mxtk8y4VWUKrtjLADgA5wOK68TWxVXGRw1GpyLlveyZ7Ga47OMXnlPKMDifYx9kpt8kZNu7XX5bNGl+xF/wWY8FftZ+OLPwjrWi3XgXxZqZZdPilu1vLDUWAyIo7gKhEpAJCPGoOMKzMQtYf/BwF/wAmV6D/ANjjZ/8ApLeV8h/8FZfhnof7Nv8AwUc8O3HgfT7bw39ss9J8SeVYxiGG3vhfTp5sSLhY8/Zo3IUDL7m6sTX15/wcBf8AJleg/wDY42f/AKS3lc8sVWqYTEUa7vKGl11/qx5tbOMficlzTAZjJSqYfTmStzJ3s7LS+nRLfyu+4/4I76xaeHv+CYXgXUNQurexsbH+2ri5ubiQRQ28aatfM7u7EBVVQSSSAACa878H/wDBaXUPjx+0x/wr34TfCWTxtb3N0YrLWLzxC2lxy26YEt7NF9jlMFupJILEuylBsEjiKvz+1D9sPxN46/ZC+Hf7Pnhtf7L0yG7uE1eaW6S3XWrm61OeaCFpGYJHbIJoizOQC+S21IwX/W3/AIJ4/sCaJ+wv8Kvsitb6r4z1pUl17V0Q4mccrBDkZWCPJCg4LElyAWwDL8VXxKp0MM+WMIx5pWW9tldP7/6enDedY/NI4XL8qn7OlQp0/azsm2+VLkipJro03bpfZLmm/af/AOCgfhz9nDWm0KPT5/EPiWBEe5tIpvs9vZhlDKJJmU/MVYMAqNx125GfJfC//BX3fq6JrXgcJYswMklhqfmTxJ6iN41Vz9XUe9eh/tdftS/Df4H/ABPsLi78L2ni74gaTbbYSFRDpkbkOokmYNsc/eUKrModj8ok+f56/aH/AG+dF/ab+G15omreA4dP1KPbLpepQ6mt1JZyh1JGDEhCsoZWwTnPTgEfi/HHHGOwGPxKoZ3TpzpN8lCNByTsr8s6lpJTeqetk/5L2X6DisXOE5JVUmtla/yb7/1off3w3+I+j/FrwVYeINBu1vdL1JC8UgBUgglWVgeVZWBBB6EGvm39oL/gqNo/w48UXmi+FdHXxFPp8jQXF/Pc+RZrIpwRGApaUA5BPyjI+UsOazf+CamsXNh+yb4+khmdHsdRu5oCDzE32KFsj05GfrXAf8ElPCGm618UPEOpXdnb3N5o+nQ/YpJEDfZmkdgzJnoxCAbhyAWGcMc+tmHHWdZrh8nwWWTjh6uOjJzny83KoLXlT011avqtFdas1ni6tSNKFN8rne79DZ8Mf8FdNYtNTEeveC9PmhyN/wBivHgmiU99sisG47Ern1FfYHgj4taP46+FNn4yhmex0O8sTqDSXu2E20QBLGTkqu0A5OSOM5I5r5v/AOCuUEZ+FfhKXy081dZZA+0bgpgkJAPXBIBx7D0qn49vprH/AIJH6f5MjRtNYWMTFTglWvoww+hGQfUE08p4kz3JM1zLLczxP1uOFw7rRbgoNtJO2l9Nbat91bYKeIq0qlSFSXNyxvtYj+IX/BXXStI1yaDw34Tm1bT4mKrfX1/9i8/BxuWLy3IU9QWKtjqoPA9yuf2s9B8Mfs2aL8SPEUcmm2utWkM0VjbuLmaWaRSywREhA7YDHJ2gBSTgAmvI/wDglP8ADrRV+D+o+JW021l12bVpbX7bJGGmihSOIiNCfurlmJxjJPOcDHLf8Ff52gf4d26MUgK6lIY14UsPsgBx6gM3/fR9aywvFHE2B4Ur8XZhiY1eeEXTpKCjGDnOMYvmVpSsnrF/+BPcUa+Ihh3iZyvdaK212kZ+sf8ABX3VjrP+g+C9LhsQ3EdzqLvM4/3lQBSfTDY9TX0P+yt+2d4f/ait7m1trWfRfENhF59zps8gkzHkL5kUgA8xASoJKqQWGVwVJ1v2avhd4d0X9nDwtYwaLpn2XU9FtZ71GtkYXskkKNI8uR85Yk5zn06YFfG/7NujW/gr/gpx/ZOlx/Y9Otdb1i0igQnakK290Vj/AN1dq4B/uj0qaWbcV5Fjcsr5njY4mljZwhKHIo8jnazi0tbX8k9ra3S9piKMoOpLmUmla21z9FKKKK/oI9oKKKKAPyP/AODiX/k4HwN/2LE3/pS9fqF+z9/yQXwT/wBgCw/9J468f/bT/wCCYvgT9urxlpOueLNa8ZaXdaPYNp8KaPdW0Mbxs5clhLbyndk9QQMdq988G+GLfwR4Q0rRbWSaS10ezhsoXmIMjpGgRSxAA3EKM4AGewrycHg6lPGVq0tpWt8j4vJMjxWFzzHY+qlyVuXl110Wt10PzR/4OO/+Ql8F/wDrjr/89Mr71/Yv/wCTO/hP/wBibo//AKRQ1yH7bf8AwTv8Gft5y+F38Xav4q0pvCa3i2n9i3FvD5oufI8zzPOglzj7OmNu3GWznjHr3wv+H9n8Jvhp4d8K6fNdXGn+GdMttKtpbllaaSKCJYkZyqqpYqgJIUDOcAdKMPhKkMdVry+GSVvkkVluS4qhxDjMyqJezqxgo66+7GKd101TPyY/Zr/5WALr/sc/E3/pBqNb/wDwcY/8ld+Hf/YAvv8A0dHX2h4G/wCCW3gHwB+2LJ8bbPXPGk3imXU77VTZz3Vq2nCW7hmikUItuJNoWdyo8zIIXJPINz9tf/gmh4G/bv8AEmi6p4t1rxhpdxoNpLZQLo1zbQpIkjBmLiWCUk5Axgge1ebLKsQ8FVoWXNKd1r00/wAj5OpwbmTyDGZekvaVaznHXTlvDd9Ho9Dyn/grJ/yiatf93Qf/AEbBWn/wQj/5MLt/+xg1D/0Na91/aI/ZC8N/tL/s7R/DPXNQ16z0OMWgFzp80Md5/ozI0fzPE6clBn5OecYqx+yR+yl4f/Y0+EMfgvwzfa3qWlx3k18JtVliluC8pBYZijjXaMcfLn3NejHB1Vj1iPs8lvnc+op5Fio8RwzNpezVFQ315r327eZ+Zf8AwXW/5SGeEf8AsVtK/wDTlf19Pf8ABwF/yZXoP/Y42f8A6S3leoftaf8ABLbwD+2R8ZtN8c+Jtc8aadq2l6fb6dFDpV1axWzxwzyzIWElvI24tMwJDAYA4ByT3n7Yv7Hvhv8Abb+Ftp4S8U6hr2madZ6nFqqS6RNDFOZY45YwpMsUi7cSsSNucgc9QeWWW1msTt+8tbX1PIq8LY+Uc2SS/wBp5eTXe19+25+Zfw//AOCXFn+0N/wSx8O/EjwXa3k/xKjuNUvLy08xpU162ivZ7b7NHH0WRY4FePaPnYyKQfMVk+k/+CMP/BRhvjh4Th+FfjTUlk8Y+H7XOi3tw+JddsYx/q2J+/cQKOf4njAc7ikr19d/swfs66L+yd8DtF8AeHrzVr/R9Ca5aCfUpI5LpzPcy3D72jREOHlYDCjgDOTknw/4m/8ABHz4a/ED9oe4+J2n6/488F+Jp9QTVwfD15aQW8V6pDNcKkttIQ7tlnGSrMzEr8zZmlllbDOnWw6V7JTj0emr9f673jB8J43Kp4XHZWlzqEYVoXtGdkryT25k769Xr/Nfwa7Gj+Fv+Cj+qN8R1t5NFXxJdzXH21N0CxyrI9m0gIx5YD255+UAZPyg19N/tweOvAPiD9lrxBFZ6x4PvrxreM6YkN3bSylvNQ/uQCTnbn7vbNdt+0J+xt4N/aR+z3GuRXlrrFrGIY9UsZFiuWQZOxwVKOuST8y5GTtK5OfHbD/gkT4VjvN114t8RS2+fuQwwRSY/wB4qw/8dr8clwdxPlNPMcsy7DUsRRxcpyVSUlGcVUVrST35d1brd9bL7b6riKSnThFSUr6311IP+CYmkya/+zD48sYdvnXup3EEe48bnsoVGfxNeRf8E5PjboPwB+KWvWXi64bQ11S1S0E1yjKltPDI2Y5eMofmblsAFCCRkV9yfAf9n3w7+zj4Rm0fw5HeLb3U5uriW6uDNJPLtVNx6KPlVRhQBx0r5d8bXn7Ov7W/xO1hrjV7rwZrMM2F1hZo7K111QoHmZlDRZDZHzBJHG0gsOF5814ZxuS4PJKtPEUYYzDKcVCpK0KnMveSlpqk7a2TbVneyc1KE6UaTTSlG+j6kX/BTn47eDvib4E8N6X4d8R6Xrl9a6kbuZbGbz0jj8l1yXXKA7mAxnPPTg1r/Ef/AJRH6X/16af/AOl8VeDftW/CX4Y/BnTtNsfBviy88W65cSma+mF5BPa2UCqwCZiQASMxBwWJAjOQNy5+0fhz+zvb/E39h7wv4H8TPqWmx3WmWc1z9lKxXMDB1uFT94jAEEAMCvqOOteVksc1z7P86hiI01WqYV07U5c0FKSSinLVX720WvVMzp+0rVqqdruNtNvI5r/glX/ybNdf9h25/wDRcNcJ/wAFf9Bup9P8A6osLNY20l9Zyy4+WOWUQPGp92WGUj/cNfS/7PvwA0f9m7wLJ4f0O61S8s5Lt7wyX8kckod1VSMoiDHyDtnrzXR+OvAmj/EzwpeaHr2n2+p6VqCbJ7eYfKwzkEEYKsCAQykFSAQQQDX6fU4FxWM4GjwzXkoVfZxjfdKUZKS1XRtJNrWz0R6DwkpYT2D0dl+Gp4n+z1+2l8NYPgB4e/tDxTpuk3mh6Vb2d7ZXb7LlJIolRtkeN0oJXIMYbII4ByB82/sk6m3xZ/4KNt4k0m3uG02TUdW1hi64eG2kinjRnHYlpogR2LY5r2/Vf+CTPgK81YzW2veLbK1diTbrPBJsHojNESAP9rcfc17X8Cv2cvCf7OmgTWPhnT2hkuyrXd5O/m3V4VGF3v6DJwqgKCWIAJOfm8Pwrxbm2Ny6OeRpUqOClGd4NylUlC3Lp0Tsr7dX2Rzxw+JqSgqtkou+nWx3VFFFfvB7AUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXg3xs/4J2fD/AOM3iG41gJqPh3VbxzLcy6XIiRXUh6u8Tqy7jySU2liSSSSTXvNFeRnWQ5dm1D6tmVGNWF7pSV7Punun5pozq0YVFyzVz53+En/BM74f/DPxDb6peyap4nurVhJDFqLp9ljcHIbykVdxHo5ZfbIzX0RRRUZHw7lmT0XQyyjGlF6vlW783u/m2KjRp0lamrBRRRXtGoUUUUAFFFFAH//Z';

  constructor(private modalService: BsModalService, private service: IndicatorGroupService, private serviceIndicator: IndicatorService) {
    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    this.selectedYearText = String(currentYear);
  }

  ngOnInit() {
    // console.log("Onit");
    // console.log(this.indicatorGroups);

    // const currentYear = new Date().getFullYear();
    // this.baseYear = 2018;
    const currentYear = 2018;
    this.baseYear = 2016;
    for (let i = 0; i <= (currentYear - this.baseYear); i++) {
      this.years[i] = this.baseYear + i;
    }

    const currentMonth = new Date().getMonth(); // 0 = Juanuary, 1 = February, ..., 11 = December
    // List of the months (numbers) from 0 to the current month (max 11)
    for (let i = 0; i <= currentMonth; i++) {
      this.months[i] = i;
    }
    this.setMonthsOfTheYear(); // List of the names of the months, based in the prior list (this.months)
    this.selectedMonth = -1;
    this.GeneraIndicadores(currentYear);
  }

  // selecciona el reporte PDF,XLS
  selectReport(report: string) {
    this.selectedReport = report;
  }

  // selecciona el año
  selectYear(year: any) {
    this.selectedYearText = year;
    this.selectedYear = year;
  }

  // selecciona periodo Trimestral,Mensual,Semanal
  selectPeriod(period: string) {
    this.selectedPeriod = period;
    this.selectOption();
  }

  // dropdown que se adapta dependiendo del periodo seleccionado
  selectOption() {
    if (this.selectedPeriod === 'Ninguno') {
      this.setTitlePeriod = ' ';
      this.setContentDropdown = 'Ninguno'; // default is shown
      this.options = [null];
      this.selectMonth = 'Ninguno';
      this.selectedTrimester='Ninguno';
    }
    if (this.selectedPeriod === 'Trimestral') {
      this.setTitlePeriod = 'Seleccione Trimestre';
      this.setContentDropdown = 'Trimestre 1'; // default is shown
      this.selectedTrimester='Trimestre 1';
      this.options = this.trimester;
    }
    if (this.selectedPeriod === 'Mensual') {
      this.setTitlePeriod = 'Seleccione Mes';
      this.setContentDropdown = 'Enero'; // default is shown
      this.selectMonth = 'Enero';
      this.options = this.monthsOfTheYear;
    }
    if (this.selectedPeriod === 'Semanal') {
      this.setTitlePeriod = 'Seleccione Semana';
      this.setContentDropdown = 'Semana 1'; // default is shown
      this.options = this.weeks;
    }

  }

  // cambia al seleccionar el contenido del ultimo dropdown
  setOptionContentDropdown(option: string) {
    this.setContentDropdown = option; // MES
   
    for(let i = 0; i<12; i++)
    {
      if (option.localeCompare(this.Months[i]) === 0)
      {
        this.selectMonth = option;
      }
    }

    for(let i = 0; i<4; i++)
    {
      if (option.localeCompare(this.trimester[i]) === 0)
      {
        this.selectedTrimester = option;
      }
    }  

  }

  setMonths() {
    const currentYear = new Date().getFullYear();
    if (this.selectedYear < currentYear) {
      this.months = [];
      for (let i = 0; i <= 11; i++) { // Months from January (0) to December (11)
        this.months[i] = i;
      }
    }
    // tslint:disable-next-line:one-line
    else {
      this.months = [];
      const currentMonth = new Date().getMonth(); // 0 = Juanuary, 1 = February, ..., 11 = Decembery
      for (let i = 0; i <= currentMonth; i++) {
        this.months[i] = i;
      }
    }
    this.setMonthsOfTheYear();
  }

  // Sets the names of the months of the selected year
  setMonthsOfTheYear() {
    this.monthsOfTheYear = [];
    this.months.forEach(month => {
      this.monthsOfTheYear[month] = Months[month];
    });
  }
  // According to the name of a month, it sets the corresponding number to the 'selectedMonth'
  setSelectedMonth(month: string) {
    this.selectedMonth = Months[month];
  }

  GeneraIndicadores(year:number) {

    for (let i = 0; i < this.indicatorGroups.length; i++) {
      for (let j = 0; j < this.indicatorGroups[i].indicators.length; j++) {
        this.indicators.push(this.indicatorGroups[i].indicators[j]);
      }
    }
  }


  downloadPDF() {
    const maxY = 260; // limite del Y para que escriba en el pdf antes de saltar a nueva pagina

    const doc = new jsPDF();

    const xImage = 140;
    const yImage = 10;

    doc.addImage(this.img, 'PNG', xImage, yImage, 60, 25);

    let y = 40;

    const n = this.indicatorGroups.length;

    let empiezaJ = 0;

    const empJ = 0;

    doc.setFontSize(20); // TITULO

    let mesString = 'Ninguno';
    let mesInt = 0;

    if (this.selectMonth.localeCompare('Ninguno') !== 0) {
      for (let i = 0; i < this.Months.length; i++) {
          if (this.selectMonth.localeCompare(this.Months[i]) === 0) {
            mesString = this.Months[i];
            mesInt = i + 1;
          }
      }
      doc.text(60, y, 'Reporte Indicadores ' + this.selectedYear + ' ' + this.selectMonth);
    } else {
      doc.text(60, y, 'Reporte Indicadores ' + this.selectedYear);
    }

    y = y + 15;


    // recorre IndicatorsGroups
    for (let i = 0; i < n; i++) {
      doc.setFontSize(15);

      const largoNombreGrupo = this.indicatorGroups[i].name.length;
      if (largoNombreGrupo > 75) {
        if (this.indicatorGroups[i].name[75] === ' ') {

          // caso cuando el nombre del indicatorGroup no cabe en una sola linea y hay un espacio en blanco

          if (y + 20 > maxY) {
            doc.addPage();
            y = 25;
          }

          doc.text(10, y, (i + 1) + '.- ' + this.indicatorGroups[i].name.substr(0, 75));
          y = y + 7;
          doc.text(15, y, this.indicatorGroups[i].name.substr(75, largoNombreGrupo));
        } else {

          // caso cuando el nombre del indicatorGroup no cabe en una sola linea y no hay espacio en blanco

          if (y + 20 > maxY) {
            doc.addPage();
            y = 25;
          }

          let num = 75;
          while (this.indicatorGroups[i].name[num] !== ' ') {
            num--;
          }


          doc.text(10, y, (i + 1) + '.- ' + this.indicatorGroups[i].name.substr(0, num));

          y = y + 7;
          doc.text(15, y, this.indicatorGroups[i].name.substr(num, largoNombreGrupo));
        }

      } else {

        if (y + 20 > maxY) {
          doc.addPage();
          y = 25;
        }

        doc.text(10, y, (i + 1) + '.- ' + this.indicatorGroups[i].name);
      }
      y = y + 5;

      // recorre los indicators por cada indicatorGroup
      for (let j = 0; j < this.indicatorGroups[i].indicators.length; j++) {
        y = y + 5;
        doc.setFontSize(10);

        const largoNombreIndicador = this.indicators[empiezaJ].name.length;
        if (largoNombreIndicador > 100) {
          if (this.indicators[empiezaJ].name[100] === ' ') { // cambio indicatorsGroup por indicators

            if (y + 5 > maxY) {
              doc.addPage();
              y = 25;
            }
            y = y + 5;
            doc.text(20, y, (j + 1) + '.- ' + this.indicators[empiezaJ].name.substr(0, 100));
            y = y + 5;
            doc.text(25, y, this.indicators[empiezaJ].name.substr(100, largoNombreIndicador));
          } else {

            if (y + 5 > maxY) {
              doc.addPage();
              y = 25;
            }

            let num = 100;
            while (this.indicators[empiezaJ].name[num] !== ' ') {
              num--;
            }
            y = y + 5;

            doc.text(20, y, (j + 1) + '.- ' + this.indicators[empiezaJ].name.substr(0, num));
            y = y + 5;
            doc.text(25, y, this.indicators[empiezaJ].name.substr(num, largoNombreIndicador));
          }

        } else {

          if (y + 5 > maxY) {
            doc.addPage();
            y = 25;
          }

          y = y + 5;
          doc.text(20, y, (j + 1) + '.- ' + this.indicators[empiezaJ].name);
        }

        y = y + 5;

        let meta = 0;

        for (let k = 0; k < this.indicators[empiezaJ].goals.length; k++) {
          const mes = this.indicators[empiezaJ].goals[k].month + 1;
          if (this.indicators[empiezaJ].goals[k].year === this.selectedYear) {
            if (mesString.localeCompare('Ninguno') === 0 && this.selectedTrimester.localeCompare('Ninguno')===0 ) {
              meta += this.indicators[empiezaJ].goals[k].value;
            } else {
              if(!(this.selectedTrimester.localeCompare('Ninguno')===0))
              {
                if(this.selectedTrimester.localeCompare('Trimestre 1')===0)
                {
                  // Entro Trimestre 1
                  for(let g=1;g<=3;g++)
                  {
                    if (g === mes) {
                      meta += this.indicators[empiezaJ].goals[k].value;
                    }
                  }
                }
                if(this.selectedTrimester.localeCompare('Trimestre 2')===0)
                {
                  // Entro Trimestre 2
                  for(let g=4;g<=6;g++)
                  {
                    if (g === mes) {
                      meta += this.indicators[empiezaJ].goals[k].value;
                    }
                  } 
                }
                if(this.selectedTrimester.localeCompare('Trimestre 3')===0)
                {
                  // Entro Trimestre 3
                  for(let g=7;g<=9;g++)
                  {
                    if (g === mes) {
                      meta += this.indicators[empiezaJ].goals[k].value;
                    }
                  }
                }
                if(this.selectedTrimester.localeCompare('Trimestre 4')===0)
                {
                  // Entro Trimestre 4
                  for(let g=10;g<=12;g++)
                  {
                    if (g === mes) {
                      meta += this.indicators[empiezaJ].goals[k].value;
                    }
                  }
                }
              }
              else if (mesInt === mes) {
                // Entro Mes
                meta += this.indicators[empiezaJ].goals[k].value;
              }
            }
          }
        }

        let cantidadRegistro = 0;
        if (this.indicators[empiezaJ].registriesType === 1) {

          for (let z = 0; z < this.indicators[empiezaJ].registries.length; z++) {
            const date: Date = new Date(this.indicators[empiezaJ].registries[z].date);
            const anio = date.getFullYear();
            const mes = date.getMonth() + 1;
            if (anio === this.selectedYear) {
              if (mesString.localeCompare('Ninguno') === 0 && this.selectedTrimester.localeCompare('Ninguno')===0 ) {
                cantidadRegistro += this.indicators[empiezaJ].registries[z].quantity;
              } else {
                if(!(this.selectedTrimester.localeCompare('Ninguno')===0))
                {
                  if(this.selectedTrimester.localeCompare('Trimestre 1')===0)
                  {
                    // Entro Trimestre 1
                    for(let g=1;g<=3;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[empiezaJ].registries[z].quantity;
                      }
                    }
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 2')===0)
                  {
                    // Entro Trimestre 2
                    for(let g=4;g<=6;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[empiezaJ].registries[z].quantity;
                      }
                    } 
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 3')===0)
                  {
                    // Entro Trimestre 3
                    for(let g=7;g<=9;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[empiezaJ].registries[z].quantity;
                      }
                    }
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 4')===0)
                  {
                    // Entro Trimestre 4
                    for(let g=10;g<=12;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[empiezaJ].registries[z].quantity;
                      }
                    }
                  }
                }
                else if (mesInt === mes) {
                  // Entro Mes
                  cantidadRegistro += this.indicators[empiezaJ].registries[z].quantity;
                }
              }
            }
          }

          doc.text(20, y, '     Cantidad Registros: ' + cantidadRegistro);
          y = y + 5;
          doc.text(20, y, '     Meta: ' + meta);

        } else if (this.indicators[empiezaJ].registriesType === 2) {
          for (let z = 0; z < this.indicators[empiezaJ].registries.length; z++) {
            const date: Date = new Date(this.indicators[empiezaJ].registries[z].date);
            const anio = date.getFullYear();
            const mes = date.getMonth() + 1;
            if (anio === this.selectedYear) {
              if (mesString.localeCompare('Ninguno') === 0 && this.selectedTrimester.localeCompare('Ninguno')===0 ) {
                cantidadRegistro += this.indicators[empiezaJ].registries[z].percent;
              } else {
                if(!(this.selectedTrimester.localeCompare('Ninguno')===0))
                {
                  if(this.selectedTrimester.localeCompare('Trimestre 1')===0)
                  {
                    // Entro Trimestre 1
                    for(let g=1;g<=3;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[empiezaJ].registries[z].percent;
                      }
                    }
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 2')===0)
                  {
                    // Entro Trimestre 2"
                    for(let g=4;g<=6;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[empiezaJ].registries[z].percent;
                      }
                    } 
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 3')===0)
                  {
                    // Entro Trimestre 3
                    for(let g=7;g<=9;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[empiezaJ].registries[z].percent;
                      }
                    }
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 4')===0)
                  {
                    // Entro Trimestre 4
                    for(let g=10;g<=12;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[empiezaJ].registries[z].percent;
                      }
                    }
                  }
                }
                else if (mesInt === mes) {
                  // Entro Mes
                  cantidadRegistro += this.indicators[empiezaJ].registries[z].percent;
                }
              }
            }
          }

          doc.text(20, y, '     Cantidad Porcentaje: ' + cantidadRegistro +  '%');
          y = y + 5;
          doc.text(20, y, '     Meta: ' + meta);

        } else {
          for (let z = 0; z < this.indicators[empiezaJ].registries.length; z++) {
            const date: Date = new Date(this.indicators[empiezaJ].registries[z].date);
            const anio = date.getFullYear();
            const mes = date.getMonth() + 1;
            if (anio === this.selectedYear) {              
              if (mesString.localeCompare('Ninguno') === 0 && this.selectedTrimester.localeCompare('Ninguno')===0 ) {
                cantidadRegistro++;
              }  else {
                if(!(this.selectedTrimester.localeCompare('Ninguno')===0))
                {
                  if(this.selectedTrimester.localeCompare('Trimestre 1')===0)
                  {
                    // Entro Trimestre 1
                    for(let g=1;g<=3;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro++;
                      }
                    }
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 2')===0)
                  {
                    // Entro Trimestre 2
                    for(let g=4;g<=6;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro++;
                      }
                    } 
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 3')===0)
                  {
                    // Entro Trimestre 3
                    for(let g=7;g<=9;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro++;
                      }
                    }
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 4')===0)
                  {
                    // Entro Trimestre 4
                    for(let g=10;g<=12;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro++;
                      }
                    }
                  }
                }
                else if (mesInt === mes) {
                  // Entro Mes
                  cantidadRegistro++;
                }
              }
            }
          }
          doc.text(20, y, '     Cantidad General: ' + cantidadRegistro);
          y = y + 5;
          doc.text(20, y, '     Meta: ' + meta);
        }


        empiezaJ++;

      }

      y = y + 10;


    }
    if (this.selectedPeriod === 'Ninguno' ) {
      doc.save('ReporteAnual.pdf');
    }

    if  (this.selectedPeriod === 'Trimestral') {
      doc.save('ReporteTrimestral.pdf');
    }

    if  (this.selectedPeriod === 'Mensual') {
      doc.save('ReporteMensual.pdf');
    }

    if  (this.selectedPeriod === 'Semanal') {
      doc.save('ReporteSemanal.pdf');
    }

  }

  hideModal() {
    this.modalRef.hide();
  }

  downloadExcel() {
    const wb = XLSX.utils.book_new();

    wb.Props = {
      Title: 'Reporte Indicadores',
      Subject: 'Informe',
      Author: 'ThinkAgro',
      CreatedDate: new Date(2017, 12, 19)
    };

    wb.SheetNames.push('Hoja 1');

    const cantidadGruposIndicadores = this.indicatorGroups.length;

    let posicionIndicador = 0;

    let meta = 0;

    let mesString = 'Ninguno';
    let mesInt = 0;

    let ws_data;

    if (this.selectMonth.localeCompare('Ninguno') !== 0) {
      // console.log('if this.selectMonth: '+this.selectMonth);
      for (let i = 0; i < this.Months.length; i++) {
          if (this.selectMonth.localeCompare(this.Months[i]) === 0) {
            mesString = this.Months[i];
            mesInt = i + 1;
          }
      }

      ws_data = [[' ', 'Reporte Indicadores ' + this.selectedYear + ' ' + this.selectMonth]];  // a row with 2 columns
    } else {
      ws_data = [[' ', 'Reporte Indicadores ' + this.selectedYear]];
    }


    ws_data.push([' ', ' ']);

    ws_data.push(['Grupo indicadores', 'Indicador', 'Meta', 'Cantidad registro']);

    for (let i = 0; i < cantidadGruposIndicadores; i++) {
      ws_data.push([this.indicatorGroups[i].name]);


      for (let j = 0; j < this.indicatorGroups[i].indicators.length; j++) {
        meta = 0;
        for (let y = 0; y < this.indicators[posicionIndicador].goals.length; y++) {
          const mes = this.indicators[posicionIndicador].goals[y].month + 1;
          if (this.indicators[posicionIndicador].goals[y].year === this.selectedYear) {
            if (mesString.localeCompare('Ninguno') === 0 && this.selectedTrimester.localeCompare('Ninguno')===0 ) {
              meta += this.indicators[posicionIndicador].goals[y].value;
            } else {
              if(!(this.selectedTrimester.localeCompare('Ninguno')===0))
              {
                if(this.selectedTrimester.localeCompare('Trimestre 1')===0)
                {
                  // Entro Trimestre 1
                  for(let g=1;g<=3;g++)
                  {
                    if (g === mes) {
                      meta += this.indicators[posicionIndicador].goals[y].value;
                    }
                  }
                }
                if(this.selectedTrimester.localeCompare('Trimestre 2')===0)
                {
                  // Entro Trimestre 2
                  for(let g=4;g<=6;g++)
                  {
                    if (g === mes) {
                      meta += this.indicators[posicionIndicador].goals[y].value;
                    }
                  } 
                }
                if(this.selectedTrimester.localeCompare('Trimestre 3')===0)
                {
                  // Entro Trimestre 3
                  for(let g=7;g<=9;g++)
                  {
                    if (g === mes) {
                      meta += this.indicators[posicionIndicador].goals[y].value;
                    }
                  }
                }
                if(this.selectedTrimester.localeCompare('Trimestre 4')===0)
                {
                  // Entro Trimestre 4
                  for(let g=10;g<=12;g++)
                  {
                    if (g === mes) {
                      meta += this.indicators[posicionIndicador].goals[y].value;
                    }
                  }
                }
              }
              else if (mesInt === mes) {
                // Entro Mes
                meta += this.indicators[posicionIndicador].goals[y].value;
              }
            }
          }
        }

        const cantidadMeta = meta.toString();

        let cantidadRegistro = 0;
        if (this.indicators[posicionIndicador].registriesType === 1) {
          for (let z = 0; z < this.indicators[posicionIndicador].registries.length; z++) {
            const date: Date = new Date(this.indicators[posicionIndicador].registries[z].date);
            const anio = date.getFullYear();
            const mes = date.getMonth() + 1;
            if (anio === this.selectedYear) {
              if (mesString.localeCompare('Ninguno') === 0 && this.selectedTrimester.localeCompare('Ninguno')===0 ) {
                cantidadRegistro += this.indicators[posicionIndicador].registries[z].quantity;
              } else {
                if(!(this.selectedTrimester.localeCompare('Ninguno')===0))
                {
                  if(this.selectedTrimester.localeCompare('Trimestre 1')===0)
                  {
                    // Entro Trimestre 1
                    for(let g=1;g<=3;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[posicionIndicador].registries[z].quantity;
                      }
                    }
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 2')===0)
                  {
                    // Entro Trimestre 2
                    for(let g=4;g<=6;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[posicionIndicador].registries[z].quantity;
                      }
                    } 
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 3')===0)
                  {
                    // Entro Trimestre 3
                    for(let g=7;g<=9;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[posicionIndicador].registries[z].quantity;
                      }
                    }
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 4')===0)
                  {
                    // Entro Trimestre 4
                    for(let g=10;g<=12;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[posicionIndicador].registries[z].quantity;
                      }
                    }
                  }
                }
                else if (mesInt === mes) {
                  // Entro Mes
                  cantidadRegistro += this.indicators[posicionIndicador].registries[z].quantity;
                }
              }
            }
          }
        } else if (this.indicators[posicionIndicador].registriesType === 2) {
          for (let z = 0; z < this.indicators[posicionIndicador].registries.length; z++) {
            const date: Date = new Date(this.indicators[posicionIndicador].registries[z].date);
            const anio = date.getFullYear();
            const mes = date.getMonth() + 1;
            if (anio === this.selectedYear) {
              if (mesString.localeCompare('Ninguno') === 0 && this.selectedTrimester.localeCompare('Ninguno') ===0 ){
                cantidadRegistro += this.indicators[posicionIndicador].registries[z].percent;
              } 
              else {
                if(!(this.selectedTrimester.localeCompare('Ninguno')===0))
                {
                  if(this.selectedTrimester.localeCompare('Trimestre 1')===0)
                  {
                    // Entro Trimestre 1
                    for(let g=1;g<=3;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[posicionIndicador].registries[z].percent;                      }
                    }
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 2')===0)
                  {
                    // Entro Trimestre 2
                    for(let g=4;g<=6;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[posicionIndicador].registries[z].percent;                      }
                    } 
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 3')===0)
                  {
                    // Entro Trimestre 3
                    for(let g=7;g<=9;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[posicionIndicador].registries[z].percent;                      }
                    }
                  }
                  if(this.selectedTrimester.localeCompare('Trimestre 4')===0)
                  {
                    // Entro Trimestre 4
                    for(let g=10;g<=12;g++)
                    {
                      if (g === mes) {
                        cantidadRegistro += this.indicators[posicionIndicador].registries[z].percent;                      }
                    }
                  }
                }
                else if (mesInt === mes) {
                  // Entro Mes
                  cantidadRegistro += this.indicators[posicionIndicador].registries[z].percent;                }
              }
            }
          }
        } else {
          for (let z = 0; z < this.indicators[posicionIndicador].registries.length; z++) {
            const date: Date = new Date(this.indicators[posicionIndicador].registries[z].date);
            const anio = date.getFullYear();
            const mes = date.getMonth() + 1;
            if (anio === this.selectedYear) {
              if (mesString.localeCompare('Ninguno') === 0 && this.selectedTrimester.localeCompare('Ninguno')===0 ){
                // cantidadRegistro = this.indicators[posicionIndicador].registries.length;
                cantidadRegistro++;
              } else {
                  if(!(this.selectedTrimester.localeCompare('Ninguno')===0))
                  {
                    if(this.selectedTrimester.localeCompare('Trimestre 1')===0)
                    {
                      // Entro Trimestre 1
                      for(let g=1;g<=3;g++)
                      {
                        if (g === mes) {
                          cantidadRegistro++;                        
                        }
                      }
                    }
                    if(this.selectedTrimester.localeCompare('Trimestre 2')===0)
                    {
                      // Entro Trimestre 2
                      for(let g=4;g<=6;g++)
                      {
                        if (g === mes) {
                          cantidadRegistro++;                        
                        }
                      } 
                    }
                    if(this.selectedTrimester.localeCompare('Trimestre 3')===0)
                    {
                      // Entro Trimestre 3
                      for(let g=7;g<=9;g++)
                      {
                        if (g === mes) {
                          cantidadRegistro++;                        
                        }
                      }
                    }
                    if(this.selectedTrimester.localeCompare('Trimestre 4')===0)
                    {
                      // Entro Trimestre 4
                      for(let g=10;g<=12;g++)
                      {
                        if (g === mes) {
                          cantidadRegistro++;                        
                        }
                      }
                    }
                  }
                  else if (mesInt === mes) {
                    // Entro Mes
                    cantidadRegistro++;                  
                  }
              }
            }
          }
        }

        const cantidadRegistros = cantidadRegistro.toString();

        ws_data.push([' ', this.indicators[posicionIndicador].name, cantidadMeta, cantidadRegistros]);
        posicionIndicador++;
      }
    }



    const ws = XLSX.utils.aoa_to_sheet(ws_data);


    wb.Sheets['Hoja 1'] = ws;


    // Export

    const wbout = XLSX.write(wb, {bookType: 'xlsx',  type: 'binary'});



    // funcion que guarda y crea el archivo
  saveAs(new Blob([this.s2ab(wbout)], {type: 'application/octet-stream'}), 'Informe General.xlsx');

  }

  s2ab(s : any) {
    const buf = new ArrayBuffer(s.length); // convert s to arrayBuffer
    const view = new Uint8Array(buf);  // create uint8array as viewer
    for (let i = 0; i < s.length; i++) {
      // tslint:disable-next-line:no-bitwise
      view[i] = s.charCodeAt(i) & 0xFF; // convert to octet
    }

    return buf;
  }

  downloadReport() {
    if (this.selectedReport === 'PDF') {
      this.downloadPDF();
    }
    if (this.selectedReport === 'XLSX') {
      this.downloadExcel();
    }
  }


}
